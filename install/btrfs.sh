#!/bin/bash
# Stop on any error (-e), on unset variables (-u), and on errors inside pipes (-o pipefail)
set -euo pipefail

# Disk name from the first argument, e.g. ./btrfs-setup.sh sda
NAME=${1:-}
# No argument given: show available disks and stop
if [ -z "$NAME" ]; then
    echo "Usage: $0 DISK   (e.g. sda or nvme0n1)"
    lsblk -d -o NAME,SIZE,MODEL,TRAN
    exit 1
fi
NAME=${NAME#/dev/}         # Strip /dev/ if someone types it anyway
DISK=/dev/$NAME            # Build the full device path
# The disk must exist as a block device
[ -b "$DISK" ] || { echo "$DISK is not a disk. Aborted."; exit 1; }

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

# Check that the live system booted in UEFI mode
[ -d /sys/firmware/efi ] || { echo "Not booted in UEFI mode. Aborted."; exit 1; }

# Show what is on the disk right now and ask for confirmation
echo "This will ERASE THE WHOLE DISK $DISK:"
lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,MODEL "$DISK"
read -rp "Type YES to continue: " ans
[ "$ans" = "YES" ] || { echo "Aborted."; exit 1; }

# --- GPT partitioning ---
swapoff -a || true         # Turn off any active swap
wipefs -a "$DISK"          # Remove old signatures
sgdisk --zap-all "$DISK"   # Delete old GPT/MBR tables
sgdisk -o "$DISK"          # Create a new, empty GPT
sgdisk -n 1:0:+1G -t 1:ef00 -c 1:EFI    "$DISK"   # 1G EFI System
sgdisk -n 2:0:+8G -t 2:8200 -c 2:swap   "$DISK"   # 8G Linux swap
sgdisk -n 3:0:0   -t 3:8300 -c 3:gentoo "$DISK"   # Rest: Linux filesystem
partprobe "$DISK"          # Kernel re-reads the partition table
udevadm settle             # Wait until the partition devices exist
sgdisk -p "$DISK"          # Print the new table

# --- EFI and swap ---
mkfs.vfat -F32 -n EFI "$EFI"   # FAT32 for UEFI
mkswap -L swap "$SWAP"         # Format swap
swapon "$SWAP"                 # Activate swap

# --- Btrfs with DUP for data and metadata ---
mkfs.btrfs -f -L gentoo -m dup -d dup "$DEV"

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

# --- Check ---
btrfs filesystem usage "$MNT"   # Should show Data, DUP and Metadata, DUP
findmnt -R "$MNT"               # Full mount tree
echo "UUIDs for fstab:"
blkid "$EFI" "$SWAP" "$DEV"
