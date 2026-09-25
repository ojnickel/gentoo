#!/usr/bin/env bash
# Enter a Gentoo root via chroot, optionally borrowing Portage config/repos from another system.
#   chroot TARGET          plain chroot
#   rescue SOURCE TARGET   bind SOURCE's /etc/portage, repos, distfiles and binpkgs into TARGET
set -euo pipefail

usage() {
    echo "Usage: $0 chroot TARGET | $0 rescue SOURCE TARGET"
    exit 1
}

action="${1:-}"
case "$action" in
    chroot) [ $# -eq 2 ] || usage; idir="";                    tdir=$(realpath -m "$2") ;;
    rescue) [ $# -eq 3 ] || usage; idir=$(realpath -m "$2");   tdir=$(realpath -m "$3") ;;
    *) usage ;;
esac

[ "$(id -u)" -eq 0 ] || { echo "Run as root."; exit 1; }
[ "$tdir" != "/" ] || { echo "TARGET must not be /"; exit 1; }
[ -d "$tdir/usr" ] || { echo "$tdir is not a Linux root"; exit 1; }
if [ "$action" = rescue ]; then
    [ -d "$idir/etc/portage" ] || { echo "$idir has no etc/portage"; exit 1; }
fi

MOUNTED=()          # Everything we mounted, in order (unmounted in reverse)
RESOLV_BAK=""       # Original resolv.conf of the target, restored on exit

# Mount only if not already mounted (makes re-runs safe) and remember it
mnt() {   # mnt DEST mount-args...
    local dest=$1; shift
    mountpoint -q "$dest" && return 0
    mkdir -p "$dest"
    mount "$@" "$dest"
    MOUNTED+=("$dest")
}

cleanup() {
    set +e
    local i
    for (( i=${#MOUNTED[@]}-1; i>=0; i-- )); do
        umount -R "${MOUNTED[i]}" 2>/dev/null || umount -Rl "${MOUNTED[i]}"
    done
    # Put back the target's own resolv.conf (file or symlink)
    if [ -n "$RESOLV_BAK" ]; then
        rm -f "$tdir/etc/resolv.conf"
        mv "$RESOLV_BAK" "$tdir/etc/resolv.conf"
    fi
}
trap cleanup EXIT   # Runs on normal exit, on errors (set -e) and on Ctrl+C

rescue() {
    mnt "$tdir/etc/portage" --bind "$idir/etc/portage"
    # Bind the repo/cache dirs at the SAME path they have in SOURCE,
    # because SOURCE's make.conf/repos.conf (now active) point there.
    local rel
    for rel in var/db/repos usr/portage var/cache/distfiles var/cache/binpkgs; do
        if [ -d "$idir/$rel" ]; then
            mnt "$tdir/$rel" --rbind "$idir/$rel"
            mount --make-rslave "$tdir/$rel"
        fi
    done
}

mkroot() {
    # DNS: never write through a symlink (would hit the HOST's file); back up and replace
    if [ -e "$tdir/etc/resolv.conf" ] || [ -L "$tdir/etc/resolv.conf" ]; then
        RESOLV_BAK="$tdir/etc/.resolv.conf.chroot-bak"
        mv "$tdir/etc/resolv.conf" "$RESOLV_BAK"
    fi
    cp -L /etc/resolv.conf "$tdir/etc/resolv.conf"

    mnt "$tdir/proc" -t proc proc
    mnt "$tdir/sys"  --rbind /sys;  mount --make-rslave "$tdir/sys"
    mnt "$tdir/dev"  --rbind /dev;  mount --make-rslave "$tdir/dev"
    mnt "$tdir/run"  --bind  /run;  mount --make-slave  "$tdir/run"
    # Some live systems have no /dev/shm mount; Python/portage needs it
    if [ ! -L "$tdir/dev/shm" ] && ! mountpoint -q "$tdir/dev/shm"; then
        mnt "$tdir/dev/shm" -t tmpfs -o nosuid,nodev,noexec shm
    fi

    chroot "$tdir" /bin/bash -l || true
}

if [ "$action" = rescue ]; then rescue; fi
mkroot
