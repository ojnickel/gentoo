#!/bin/bash
# Full install run: partition + Btrfs -> stage3 -> chroot
# Usage: ./install.sh DISK [VARIANT]      e.g. ./install.sh nvme0n1 openrc
#        DATA=single ./install.sh sda     (passed on to btrfs.sh)
# To resume after a failure, run the remaining steps on their own:
#        ./stage3.sh [VARIANT]   and/or   ./chroot.sh chroot /mnt/gentoo
set -euo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)   # Folder with the other scripts
DISK=${1:-}
VARIANT=${2:-openrc}

if [ -z "$DISK" ]; then
    echo "Usage: $0 DISK [VARIANT]   (VARIANT: openrc, systemd, nomultilib-openrc, ...)"
    lsblk -d -o NAME,SIZE,MODEL,TRAN
    exit 1
fi

# Called with bash explicitly, so it also works from noexec USB sticks
echo "=== 1/3 Partition and Btrfs ==="
bash "$DIR/btrfs.sh" "$DISK"

echo "=== 2/3 Stage3 ==="
bash "$DIR/stage3.sh" "$VARIANT"

echo "=== 3/3 Chroot ==="
bash "$DIR/chroot.sh" chroot /mnt/gentoo
