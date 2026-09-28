#!/bin/bash
# Partition a disk (GPT, UEFI) and create the root filesystem for a Gentoo install.
#
# Usage: ./disk.sh DISK            e.g. ./disk.sh sda   or   ./disk.sh nvme0n1
#
# Everything below can be overridden from the environment:
#   FS=btrfs|ext4|xfs   Root filesystem                     (default: btrfs)
#   DATA=dup|single     Btrfs data profile, btrfs only      (default: dup)
#   EFI_SIZE=1G         EFI system partition size           (default: 1G)
#   SWAP_SIZE=8G        Swap partition size, 0 = no swap    (default: 8G)
#   LABEL=gentoo        Root filesystem label               (default: gentoo)
#   MNT=/mnt/gentoo     Where the new system is mounted     (default: /mnt/gentoo)
#   CONFIRM=YES         Skip the interactive confirmation
#
# Layout: 1 = EFI System, 2 = swap (unless SWAP_SIZE=0), last = root.
# Btrfs additionally gets the subvolumes @ (/), @home and @snapshots.
#
# Stop on any error (-e), on unset variables (-u), and on errors inside pipes (-o pipefail)
set -euo pipefail

FS=${FS:-btrfs}
DATA=${DATA:-dup}          # Btrfs data profile: dup (2 copies, half the space) or single
EFI_SIZE=${EFI_SIZE:-1G}
SWAP_SIZE=${SWAP_SIZE:-8G}
LABEL=${LABEL:-gentoo}
MNT=${MNT:-/mnt/gentoo}    # Where the new system gets mounted
FSTAB=${FSTAB:-/tmp/fstab.gentoo}   # Generated fstab, copied in after stage3

# Disk name from the first argument
NAME=${1:-}
# No argument given: show available disks and stop
if [ -z "$NAME" ]; then
    echo "Usage: $0 DISK   (e.g. sda or nvme0n1)"
    echo "       FS=ext4 $0 DISK          (root filesystem: btrfs, ext4, xfs)"
    echo "       SWAP_SIZE=0 $0 DISK      (no swap partition)"
    echo "       DATA=single $0 DISK      (btrfs data profile, default: dup)"
    lsblk -d -o NAME,SIZE,MODEL,TRAN
    exit 1
fi
NAME=${NAME#/dev/}         # Strip /dev/ if someone types it anyway
DISK=/dev/$NAME            # Build the full device path

# Must run as root
[ "$(id -u)" -eq 0 ] || { echo "Run as root. Aborted."; exit 1; }
# The disk must exist as a whole-disk block device (not a partition)
[ -b "$DISK" ] || { echo "$DISK is not a disk. Aborted."; exit 1; }
[ "$(lsblk -dno TYPE "$DISK")" = "disk" ] || { echo "$DISK is not a whole disk. Aborted."; exit 1; }

# --- Filesystem-specific settings ---
# MKFS  how the root filesystem is created
# OPTS  mount options, also written to the fstab
# RPASS fsck pass for / in the fstab (ext4 is the only one checked at boot)
TOOLS=(sgdisk wipefs partprobe mkfs.vfat mkswap blkid "mkfs.$FS")
case "$FS" in
    btrfs)
        case "$DATA" in dup|single) ;; *) echo "DATA must be dup or single. Aborted."; exit 1 ;; esac
        MKFS=(mkfs.btrfs -f -L "$LABEL" -m dup -d "$DATA")
        OPTS=noatime,compress=zstd:3   # No access-time writes, zstd compression level 3
        RPASS=0
        TOOLS+=(btrfs)                 # needed below to create the subvolumes
        ;;
    ext4)
        MKFS=(mkfs.ext4 -F -L "$LABEL")
        OPTS=noatime
        RPASS=1                        # ext4 is checked at boot
        ;;
    xfs)
        MKFS=(mkfs.xfs -f -L "$LABEL")
        OPTS=noatime
        RPASS=0                        # xfs replays its log itself, no boot-time fsck
        ;;
    *)
        echo "FS must be btrfs, ext4 or xfs (got '$FS'). Aborted."; exit 1 ;;
esac

# All needed tools must be present in the live system
for t in "${TOOLS[@]}"; do
    command -v "$t" >/dev/null || { echo "Missing tool: $t. Aborted."; exit 1; }
done

# NVMe/eMMC names end in a digit and need a "p" before the partition number
case "$DISK" in
    *[0-9]) P=p ;;   # /dev/nvme0n1 -> /dev/nvme0n1p1
    *)      P=  ;;   # /dev/sda     -> /dev/sda1
esac

# --- Partition numbering: swap is optional, so the root number shifts ---
EFI=${DISK}${P}1
if [ "$SWAP_SIZE" = 0 ]; then
    SWAP=""
    DEV=${DISK}${P}2
else
    SWAP=${DISK}${P}2
    DEV=${DISK}${P}3
fi

# Check that the live system booted in UEFI mode
[ -d /sys/firmware/efi ] || { echo "Not booted in UEFI mode. Aborted."; exit 1; }

# Show what is on the disk right now and ask for confirmation
echo "This will ERASE THE WHOLE DISK $DISK:"
lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,MODEL,MOUNTPOINTS "$DISK"
echo
if [ "$FS" = btrfs ]; then
    echo "  Root filesystem: btrfs (data=$DATA, metadata=dup), subvolumes @ /@home /@snapshots"
else
    echo "  Root filesystem: $FS"
fi
echo "  EFI partition:   $EFI_SIZE"
if [ -n "$SWAP" ]; then echo "  Swap partition:  $SWAP_SIZE"; else echo "  Swap partition:  none"; fi
echo "  Mountpoint:      $MNT"
echo
if [ "${CONFIRM:-}" = "YES" ]; then
    echo "Confirmed via CONFIRM=YES (e.g. from tui.sh)"
else
    read -rp "Type YES to continue: " ans
    [ "$ans" = "YES" ] || { echo "Aborted."; exit 1; }
fi

# --- Release the disk (leftovers from an earlier run) ---
umount -R "$MNT" 2>/dev/null || true               # Old mounts under the mountpoint
for p in $(lsblk -lnpo NAME,TYPE "$DISK" | awk '$2=="part"{print $1}'); do
    swapoff "$p" 2>/dev/null || true                # Swap on this disk
    umount "$p" 2>/dev/null || true                 # Other mounts of this disk
    # Best effort: sgdisk --zap-all below removes the table anyway, so a
    # still-busy partition must not kill the whole run here.
    wipefs -a "$p" 2>/dev/null || echo "Note: could not wipe $p (still in use?), continuing"
done

# --- GPT partitioning ---
wipefs -a "$DISK"          # Remove old signatures on the whole disk
sgdisk --zap-all "$DISK"   # Delete old GPT/MBR tables (leaves an empty disk)
sgdisk -n "1:0:+$EFI_SIZE" -t 1:ef00 -c 1:EFI "$DISK"        # EFI System
if [ -n "$SWAP" ]; then
    sgdisk -n "2:0:+$SWAP_SIZE" -t 2:8200 -c 2:swap "$DISK"  # Linux swap
    sgdisk -n 3:0:0 -t 3:8300 -c "3:$LABEL" "$DISK"          # Rest: root
else
    sgdisk -n 2:0:0 -t 2:8300 -c "2:$LABEL" "$DISK"          # Rest: root
fi
partprobe "$DISK"          # Kernel re-reads the partition table
udevadm settle             # Wait for udev
# Wait up to 10s until all partition devices exist
for _ in $(seq 10); do
    [ -b "$EFI" ] && [ -b "$DEV" ] && { [ -z "$SWAP" ] || [ -b "$SWAP" ]; } && break
    sleep 1
done
[ -b "$DEV" ] || { echo "Partitions did not appear. Aborted."; exit 1; }
sgdisk -p "$DISK"          # Print the new table

# --- EFI and swap ---
mkfs.vfat -F32 -n EFI "$EFI"   # FAT32 for UEFI
if [ -n "$SWAP" ]; then
    mkswap -L swap "$SWAP"
    swapon "$SWAP"
fi

# --- Root filesystem ---
"${MKFS[@]}" "$DEV"

mkdir -p "$MNT"
if [ "$FS" = btrfs ]; then
    # --- Subvolumes: @ is the root, so snapshots of / never include /home ---
    mount "$DEV" "$MNT"                        # Mount top level
    btrfs subvolume create "$MNT/@"            # Root /
    btrfs subvolume create "$MNT/@home"        # /home
    btrfs subvolume create "$MNT/@snapshots"   # /.snapshots
    umount "$MNT"

    mount -o "$OPTS,subvol=@" "$DEV" "$MNT"
    mkdir -p "$MNT"/{home,.snapshots,boot/efi}
    mount -o "$OPTS,subvol=@home" "$DEV" "$MNT/home"
    mount -o "$OPTS,subvol=@snapshots" "$DEV" "$MNT/.snapshots"
else
    # ext4/xfs have no subvolumes: one filesystem holds / and /home
    mount -o "$OPTS" "$DEV" "$MNT"
    mkdir -p "$MNT/boot/efi"
fi
mount "$EFI" "$MNT/boot/efi"

# --- fstab (stage3 would overwrite etc/fstab, so it goes to /tmp first) ---
U_EFI=$(blkid -s UUID -o value "$EFI")
U_ROOT=$(blkid -s UUID -o value "$DEV")
{
    echo "# <fs>              <mountpoint>  <type>  <opts>                   <dump> <pass>"
    if [ "$FS" = btrfs ]; then
        echo "UUID=$U_ROOT  /             btrfs   $OPTS,subvol=@           0 $RPASS"
        echo "UUID=$U_ROOT  /home         btrfs   $OPTS,subvol=@home       0 0"
        echo "UUID=$U_ROOT  /.snapshots   btrfs   $OPTS,subvol=@snapshots  0 0"
    else
        echo "UUID=$U_ROOT  /             $FS    $OPTS                     0 $RPASS"
    fi
    echo "UUID=$U_EFI   /boot/efi     vfat    umask=0077               0 2"
    if [ -n "$SWAP" ]; then
        echo "UUID=$(blkid -s UUID -o value "$SWAP")  none          swap    sw                       0 0"
    fi
} > "$FSTAB"

# --- Check ---
if [ "$FS" = btrfs ]; then
    btrfs filesystem usage "$MNT"   # Metadata should show DUP, Data shows $DATA
fi
findmnt -R "$MNT"                   # Full mount tree
echo
cat "$FSTAB"
echo
echo "After extracting stage3:  cp $FSTAB $MNT/etc/fstab"
