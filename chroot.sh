#!/usr/bin/env bash
set -euo pipefail

usage() {
    echo "Usage: $0 chroot TARGET | $0 rescue SOURCE TARGET"
    exit 1
}

action="${1:-}"
case "$action" in
    chroot) [ $# -eq 2 ] || usage; idir=""; tdir="${2%/}" ;;
    rescue) [ $# -eq 3 ] || usage; idir="${2%/}"; tdir="${3%/}" ;;
    *) usage ;;
esac

[ -n "$tdir" ] && [ -d "$tdir/usr" ] || { echo "$tdir is not a Linux root"; exit 1; }

rescue() {
    mkdir -p "$tdir/var/db/repos/gentoo" "$tdir/var/cache/binpkgs"
    mount --bind  "$idir/etc/portage"          "$tdir/etc/portage"
    mount --bind  "$idir/var/db/repos/gentoo"  "$tdir/var/db/repos/gentoo"
    mount --rbind "$idir/var/cache/binpkgs"    "$tdir/var/cache/binpkgs"
}

mkroot() {
    cp -L /etc/resolv.conf "$tdir/etc/resolv.conf"
    mount --rbind /dev "$tdir/dev"; mount --make-rslave "$tdir/dev"
    mount -t proc /proc "$tdir/proc"
    mount --rbind /sys "$tdir/sys"; mount --make-rslave "$tdir/sys"
    mount --rbind /run "$tdir/run"; mount --make-rslave "$tdir/run"
    mount --rbind /tmp "$tdir/tmp"
    chroot "$tdir" /bin/bash -l || true
}

cleanup() {
    for m in dev sys run tmp proc var/cache/binpkgs var/db/repos/gentoo etc/portage; do
        if mountpoint -q "$tdir/$m"; then umount -R "$tdir/$m" || true; fi
    done
}

if [ "$action" = "rescue" ]; then rescue; fi
mkroot
cleanup
