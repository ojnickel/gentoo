#!/bin/bash
# Stop on any error (-e), on unset variables (-u), and on errors inside pipes (-o pipefail)
set -euo pipefail

# Disk name from the first argument, e.g. ./btrfs.sh sda
NAME=${1:-}
# No argument given: show available disks and stop
if [ -z "$NAME" ]; then
    echo "Usage: $0 DISK   (e.g. sda or nvme0n1)"
    echo "       DATA=single $0 DISK   (data profile, default: dup)"
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
# All needed tools must be present in the live system
for t in sgdisk wipefs partprobe mkfs.vfat mkswap mkfs.btrfs btrfs blkid; do
    command -v "$t" >/dev/null || { echo "Missing tool: $t. Aborted."; exit 1; }
done

# NVMe/eMMC names end in a digit and need a "p" before the partition number
case "$DISK" in
    *[0-9]) P=p ;;   # /dev/nvme0n1 -> /dev/nvme0n1p1
    *)      P=  ;;   # /dev/sda     -> /dev/sda1
esac

EFI=${DISK}${P}1           # Partition 1: EFI system partition
SWAP=${DISK}${P}2          # Partition 2: swap
DEV=${DISK}${P}3           # Partition 3: Btrfs root
MNT=/mnt/gentoo            # Where the new system gets mounted
OPTS=noatime,compress=zstd:3   # No access-time writes, zstd compression level 3
DATA=${DATA:-dup}          # Btrfs data profile: dup (2 copies, half the space) or single
FSTAB=/tmp/fstab.gentoo    # Generated fstab, copy into the new system after stage3

case "$DATA" in dup|single) ;; *) echo "DATA must be dup or single. Aborted."; exit 1 ;; esac

# Check that the live system booted in UEFI mode
[ -d /sys/firmware/efi ] || { echo "Not booted in UEFI mode. Aborted."; exit 1; }

# Show what is on the disk right now and ask for confirmation
echo "This will ERASE THE WHOLE DISK $DISK:"
lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,MODEL,MOUNTPOINTS "$DISK"
if [ "${CONFIRM:-}" = "YES" ]; then
    echo "Confirmed via CONFIRM=YES (e.g. from tui.sh)"
else
    read -rp "Type YES to continue: " ans
    [ "$ans" = "YES" ] || { echo "Aborted."; exit 1; }
fi

# --- Release the disk (leftovers from an earlier run) ---
umount -R "$MNT" 2>/dev/null || true               # Old mounts under /mnt/gentoo
for p in $(lsblk -lnpo NAME,TYPE "$DISK" | awk '$2=="part"{print $1}'); do
    swapoff "$p" 2>/dev/null || true                # Swap on this disk
    umount "$p" 2>/dev/null || true                 # Other mounts of this disk
    wipefs -a "$p"                                  # Old filesystem signatures on the partition
done

# --- GPT partitioning ---
wipefs -a "$DISK"          # Remove old signatures on the whole disk
sgdisk --zap-all "$DISK"   # Delete old GPT/MBR tables (leaves an empty disk)
sgdisk -n 1:0:+1G -t 1:ef00 -c 1:EFI    "$DISK"   # 1G EFI System
sgdisk -n 2:0:+8G -t 2:8200 -c 2:swap   "$DISK"   # 8G Linux swap
sgdisk -n 3:0:0   -t 3:8300 -c 3:gentoo "$DISK"   # Rest: Linux filesystem
partprobe "$DISK"          # Kernel re-reads the partition table
udevadm settle             # Wait for udev
# Wait up to 10s until all three partition devices exist
for _ in $(seq 10); do
    [ -b "$EFI" ] && [ -b "$SWAP" ] && [ -b "$DEV" ] && break
    sleep 1
done
[ -b "$DEV" ] || { echo "Partitions did not appear. Aborted."; exit 1; }
sgdisk -p "$DISK"          # Print the new table

# --- EFI and swap ---
mkfs.vfat -F32 -n EFI "$EFI"   # FAT32 for UEFI
mkswap -L swap "$SWAP"         # Format swap
swapon "$SWAP"                 # Activate swap

# --- Btrfs: metadata always DUP, data per $DATA ---
mkfs.btrfs -f -L gentoo -m dup -d "$DATA" "$DEV"

# --- Subvolumes ---
mkdir -p "$MNT"
mount "$DEV" "$MNT"                        # Mount top level
btrfs subvolume create "$MNT/@"            # Root /
btrfs subvolume create "$MNT/@home"        # /home
btrfs subvolume create "$MNT/@snapshots"   # /.snapshots
umount "$MNT"

# --- Final mounts ---
mount -o "$OPTS,subvol=@" "$DEV" "$MNT"
mkdir -p "$MNT"/{home,.snapshots,boot/efi}
mount -o "$OPTS,subvol=@home" "$DEV" "$MNT/home"
mount -o "$OPTS,subvol=@snapshots" "$DEV" "$MNT/.snapshots"
mount "$EFI" "$MNT/boot/efi"

# --- fstab (stage3 would overwrite etc/fstab, so it goes to /tmp first) ---
U_EFI=$(blkid -s UUID -o value "$EFI")
U_SWAP=$(blkid -s UUID -o value "$SWAP")
U_ROOT=$(blkid -s UUID -o value "$DEV")
cat > "$FSTAB" <<FSTAB_EOF
# <fs>              <mountpoint>  <type>  <opts>                          <dump> <pass>
UUID=$U_ROOT  /             btrfs   $OPTS,subvol=@           0 0
UUID=$U_ROOT  /home         btrfs   $OPTS,subvol=@home       0 0
UUID=$U_ROOT  /.snapshots   btrfs   $OPTS,subvol=@snapshots  0 0
UUID=$U_EFI   /boot/efi     vfat    umask=0077               0 2
UUID=$U_SWAP  none          swap    sw                       0 0
FSTAB_EOF

# --- Check ---
btrfs filesystem usage "$MNT"   # Metadata should show DUP, Data shows $DATA
findmnt -R "$MNT"               # Full mount tree
echo
cat "$FSTAB"
echo
echo "After extracting stage3:  cp $FSTAB $MNT/etc/fstab"
