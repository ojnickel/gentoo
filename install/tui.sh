#!/bin/bash
# TUI front end for the Gentoo install scripts.
# Uses dialog (on the Gentoo live ISO), else whiptail, else plain text menus.
set -euo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)   # Folder with btrfs.sh, stage3.sh, chroot.sh
MNT=/mnt/gentoo
TITLE="Gentoo install"
H=20; W=76; LH=10                    # Dialog height, width, list height

[ "$(id -u)" -eq 0 ] || { echo "Run as root."; exit 1; }

if   command -v dialog   >/dev/null; then UI=dialog
elif command -v whiptail >/dev/null; then UI=whiptail
else UI=plain
fi

# ---------- UI helpers (results on stdout, text on stderr) ----------

# clear screen; never fatal (clear fails on TERM=dumb or unknown terminals)
cls() { clear 2>/dev/null || printf '\n\n'; }

# menu TEXT TAG DESC [TAG DESC ...]  -> prints chosen TAG, returns 1 on cancel
menu() {
    local text=$1; shift
    if [ "$UI" != plain ]; then
        "$UI" --title "$TITLE" --menu "$text" $H $W $LH "$@" 3>&1 1>&2 2>&3
        return
    fi
    local -a tags=(); local i=1 n
    printf '\n%s\n' "$text" >&2
    while [ $# -gt 0 ]; do
        tags+=("$1"); printf '%3d) %-20s %s\n' "$i" "$1" "$2" >&2
        shift 2; i=$((i + 1))
    done
    read -rp "Choice (empty = cancel): " n
    [[ "$n" =~ ^[0-9]+$ ]] && [ "$n" -ge 1 ] && [ "$n" -le ${#tags[@]} ] || return 1
    echo "${tags[n-1]}"
}

# yesno TEXT  -> returns 0 for yes
yesno() {
    if [ "$UI" != plain ]; then
        "$UI" --title "$TITLE" --yesno "$1" $H $W
        return
    fi
    local a; printf '\n%b\n' "$1" >&2
    read -rp "[y/N] " a
    [[ "$a" =~ ^[yYjJ] ]]
}

# input TEXT  -> prints what was typed, returns 1 on cancel
input() {
    if [ "$UI" != plain ]; then
        "$UI" --title "$TITLE" --inputbox "$1" 10 $W 3>&1 1>&2 2>&3
        return
    fi
    local a; printf '\n%b\n' "$1" >&2
    read -rp "> " a
    echo "$a"
}

# msg TEXT
msg() {
    if [ "$UI" != plain ]; then
        "$UI" --title "$TITLE" --msgbox "$1" $H $W
        return
    fi
    printf '\n%b\n' "$1" >&2
    read -rp "Press Enter..." _
}

# run LABEL CMD...  -> runs a step in the normal terminal, stops the TUI on failure
run() {
    local label=$1; shift
    printf '\n=== %s ===\n' "$label"
    if "$@"; then
        return 0
    else
        local rc=$?
        read -rp "Step '$label' failed (exit $rc). Press Enter..." _
        msg "Step '$label' failed (exit $rc).\n\nFix the problem, then start tui.sh again and resume with 'Stage3 only' or 'Chroot only'."
        exit 1
    fi
}

# ---------- Choices ----------

pick_disk() {
    local -a items=(); local d size model note
    while read -r d; do
        size=$(lsblk -dno SIZE "$d" | tr -d ' ')
        model=$(lsblk -dno MODEL "$d" | sed 's/ *$//')
        note=""
        lsblk -no MOUNTPOINT "$d" | grep -q . && note="  [IN USE]"
        items+=("${d#/dev/}" "$size  ${model:-?}$note")
    done < <(lsblk -dnpo NAME,TYPE | awk '$2 == "disk" && $1 !~ /zram/ {print $1}')
    [ ${#items[@]} -gt 0 ] || { msg "No disks found."; exit 1; }
    menu "Target disk - it will be COMPLETELY ERASED:" "${items[@]}"
}

pick_variant() {
    menu "Stage3 variant:" \
        openrc            "OpenRC (default)" \
        nomultilib-openrc "OpenRC, no 32-bit libraries" \
        desktop-openrc    "OpenRC, desktop profile" \
        systemd           "systemd" \
        desktop-systemd   "systemd, desktop profile"
}

pick_data() {
    menu "Btrfs data profile (metadata is always dup):" \
        dup    "2 copies of data - protects against bad blocks, half the space" \
        single "1 copy of data - full space"
}

enter_chroot() {
    if yesno "Enter the chroot in $MNT now?\n\nLeave it with 'exit'; mounts are cleaned up automatically."; then
        cls
        run "Chroot" bash "$DIR/chroot.sh" chroot "$MNT"
        msg "Left the chroot. Mounts under $MNT (except the disk itself) were removed."
    fi
}

# ---------- Modes ----------

full_install() {
    local disk data variant typed
    disk=$(pick_disk)       || exit 0
    data=$(pick_data)       || exit 0
    variant=$(pick_variant) || exit 0

    yesno "Summary:\n\n  Disk:     /dev/$disk  (EFI 1G, swap 8G, rest Btrfs)\n  Data:     $data\n  Stage3:   $variant\n  Mount:    $MNT\n\nCurrent contents:\n$(lsblk -o NAME,SIZE,FSTYPE,LABEL "/dev/$disk")\n\nContinue?" || exit 0

    typed=$(input "ALL DATA ON /dev/$disk WILL BE LOST.\n\nType the disk name ($disk) to confirm:") || exit 0
    [ "$typed" = "$disk" ] || { msg "Input did not match. Nothing was changed."; exit 0; }

    cls
    run "1/3 Partition and Btrfs" env CONFIRM=YES DATA="$data" bash "$DIR/btrfs.sh" "$disk"
    run "2/3 Stage3"              bash "$DIR/stage3.sh" "$variant"
    read -rp "Disk and stage3 done. Press Enter..." _
    enter_chroot
}

stage3_only() {
    mountpoint -q "$MNT" || { msg "$MNT is not mounted.\n\nMount the new root there first (or use 'Full install')."; exit 1; }
    local variant
    variant=$(pick_variant) || exit 0
    cls
    run "Stage3" bash "$DIR/stage3.sh" "$variant"
    read -rp "Stage3 done. Press Enter..." _
    enter_chroot
}

# ---------- Main ----------

mode=$(menu "What do you want to do?" \
    full   "Full install: partition, Btrfs, stage3, chroot" \
    stage3 "Stage3 only (new root already mounted at $MNT)" \
    chroot "Chroot only (enter $MNT)") || exit 0

case "$mode" in
    full)   full_install ;;
    stage3) stage3_only ;;
    chroot) enter_chroot ;;
esac
cls
