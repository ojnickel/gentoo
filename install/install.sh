#!/bin/bash
# Full install run: partition + filesystem -> stage3 -> chroot
#
# Usage: ./install.sh DISK [VARIANT]      e.g. ./install.sh nvme0n1 openrc
#        FS=ext4 ./install.sh sda         root filesystem: btrfs (default), ext4, xfs
#        SWAP_SIZE=0 ./install.sh sda     no swap partition
#        DATA=single ./install.sh sda     btrfs data profile (btrfs only)
# All disk.sh variables are passed through the environment.
#
# To resume after a failure, run the remaining steps on their own:
#        ./stage3.sh [VARIANT]   and/or   ./chroot.sh chroot /mnt/gentoo
# chroot.sh copies setup.sh to /root/setup.sh - run it once inside the chroot:
#        bash /root/setup.sh
set -euo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)   # Folder with the other scripts
DISK=${1:-}
VARIANT=${2:-openrc}

if [ -z "$DISK" ]; then
    echo "Usage: $0 DISK [VARIANT]   (VARIANT: openrc, systemd, nomultilib-openrc, ...)"
    echo "       FS=ext4 $0 DISK     (root filesystem: btrfs, ext4, xfs)"
    lsblk -d -o NAME,SIZE,MODEL,TRAN
    exit 1
fi

# Called with bash explicitly, so it also works from noexec USB sticks
echo "=== 1/3 Partition and filesystem ==="
bash "$DIR/disk.sh" "$DISK"

echo "=== 2/3 Stage3 ==="
bash "$DIR/stage3.sh" "$VARIANT"

echo "=== 3/3 Chroot ==="
echo "Inside the chroot, run:  bash /root/setup.sh"
bash "$DIR/chroot.sh" chroot /mnt/gentoo
