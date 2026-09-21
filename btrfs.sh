#!/bin/bash
set -euo pipefail

DEV=/dev/nvme0n1p3
MNT=/mnt/gentoo
OPTS=noatime,compress=zstd:3

echo "This will ERASE $DEV:"
lsblk -o NAME,SIZE,TYPE,FSTYPE "$DEV"
read -rp "Type YES to continue: " ans
[ "$ans" = "YES" ] || { echo "Aborted."; exit 1; }

# Filesystem with DUP for data and metadata
mkfs.btrfs -f -L gentoo -m dup -d dup "$DEV"

# Subvolumes
mkdir -p "$MNT"
mount "$DEV" "$MNT"
btrfs subvolume create "$MNT/@"
btrfs subvolume create "$MNT/@home"
btrfs subvolume create "$MNT/@snapshots"
umount "$MNT"

# Mount with zstd compression
mount -o "$OPTS,subvol=@" "$DEV" "$MNT"
mkdir -p "$MNT"/{home,.snapshots,boot/efi}
mount -o "$OPTS,subvol=@home" "$DEV" "$MNT/home"
mount -o "$OPTS,subvol=@snapshots" "$DEV" "$MNT/.snapshots"

# Check
btrfs filesystem usage "$MNT"
findmnt -R "$MNT"
echo "UUID for fstab:"; blkid -s UUID -o value "$DEV"
