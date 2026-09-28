#!/bin/bash
# Gentoo base setup INSIDE the chroot: binhost, make.conf, locale, kernel, services,
# user, Sway (Wayland) desktop, GRUB. Asks everything at the start, then runs alone.
# Safe to re-run: finished steps are skipped (markers in /var/lib/setup.sh/).
# Usage (in the chroot):  bash /root/setup.sh
set -euo pipefail

DONE=/var/lib/setup.sh          # Step markers
LOG=/var/log/setup.log          # Full log
mkdir -p "$DONE"
exec > >(tee -a "$LOG") 2>&1    # Everything also goes to the log
TEE_PID=$!                      # tee is not a child job, so the shell would not wait for it
# Without this the last lines can be lost when the script exits before tee flushes
flush_log() {
    exec 1>&- 2>&-                              # close the pipe so tee sees EOF
    if [ -n "${TEE_PID:-}" ]; then wait "$TEE_PID" 2>/dev/null || true; fi
}
trap flush_log EXIT

# ---------- Checks ----------
[ "$(id -u)" -eq 0 ] || { echo "Run as root."; exit 1; }
[ -f /etc/gentoo-release ] || { echo "Not a Gentoo system (run it inside the chroot)."; exit 1; }
mountpoint -q /proc || { echo "/proc not mounted - start via chroot.sh."; exit 1; }
# GRUB needs the EFI partition - check now, not after 1-2 hours of emerging
mountpoint -q /boot/efi || { echo "/boot/efi is not mounted. From the live system run:"; \
    echo "  mount /dev/<disk>1 /mnt/gentoo/boot/efi   (NVMe: /dev/nvme0n1p1)"; exit 1; }

# ---------- Questions (Enter = default) ----------
ask() {   # ask VAR "Question" default
    local a=""; read -rp "$2 [$3]: " a || true
    printf -v "$1" '%s' "${a:-$3}"
}
echo "=== Gentoo setup - press Enter to accept the value in [brackets] ==="
ask HOSTNAME "Hostname"                 gentoo
ask USERNAME "User name"                ossi
ask TZONE    "Time zone"                Europe/Berlin
ask SYSLANG  "System language"          en_US.UTF-8
ask KBD      "Keyboard layout (xkb)"    de
ask CONSKBD  "Console keymap"           de-latin1-nodeadkeys
# The binary host is built against the PLAIN profile. The desktop profile flips
# USE flags globally, so most binary packages stop matching and get compiled
# from source instead - hours rather than minutes. Sway does not need it.
ask PROFKIND "Profile: 'plain' (matches binhost, fast) or 'desktop'" plain
[[ "$USERNAME" =~ ^[a-z_][a-z0-9_-]*$ ]] || { echo "Invalid user name."; exit 1; }
[ -e "/usr/share/zoneinfo/$TZONE" ] || { echo "Unknown time zone $TZONE."; exit 1; }
case "$PROFKIND" in plain|desktop) ;; *) echo "Profile must be plain or desktop."; exit 1 ;; esac

# ---------- Detect the init system of the extracted stage3 ----------
# tui.sh offers systemd stage3 variants, so nothing here may assume OpenRC.
if [ -x /usr/lib/systemd/systemd ]; then INIT=systemd; else INIT=openrc; fi

# Profile must match BOTH the init system and the desktop choice.
# All four combinations exist as real profiles in profiles.desc.
PROFILE=default/linux/amd64/23.0
if [ "$PROFKIND" = desktop ]; then PROFILE=$PROFILE/desktop; fi
if [ "$INIT" = systemd ];     then PROFILE=$PROFILE/systemd; fi

# ---------- Detect hardware ----------
CPUS=$(nproc)
MEM_GB=$(( $(awk '/MemTotal/ {print $2}' /proc/meminfo) / 1024 / 1024 ))
JOBS=$(( MEM_GB / 2 )); [ "$JOBS" -lt 1 ] && JOBS=1; [ "$JOBS" -gt "$CPUS" ] && JOBS=$CPUS   # ~2 GB RAM per job

# x86-64-v3 needs AVX2, BMI2, FMA, MOVBE
LEVEL=x86-64
grep -qw avx2 /proc/cpuinfo && grep -qw bmi2 /proc/cpuinfo && grep -qw fma /proc/cpuinfo \
    && grep -qw movbe /proc/cpuinfo && LEVEL=x86-64-v3

# GPU from PCI class 0x03xxxx (display controllers)
VIDEO=""
for d in /sys/bus/pci/devices/*; do
    [[ "$(cat "$d/class")" == 0x03* ]] || continue
    case "$(cat "$d/vendor")" in
        0x8086) VIDEO="$VIDEO intel" ;;
        0x1002) VIDEO="$VIDEO amdgpu radeonsi" ;;
        0x10de) VIDEO="$VIDEO nouveau" ;;
    esac
done
VIDEO=$(echo "$VIDEO" | xargs -n1 | sort -u | xargs)   # de-duplicate
[ -n "$VIDEO" ] || VIDEO="fbdev"
INTEL_CPU=no; grep -q GenuineIntel /proc/cpuinfo && INTEL_CPU=yes

cat <<INFO

  Hostname:  $HOSTNAME        User: $USERNAME
  Time zone: $TZONE    Language: $SYSLANG    Keyboard: $KBD / $CONSKBD
  Init:      $INIT (detected from the stage3)
  Profile:   $PROFILE
  CPU:       $CPUS threads, $MEM_GB GB RAM -> MAKEOPTS -j$JOBS, binhost $LEVEL
  GPU:       VIDEO_CARDS="$VIDEO"
  Desktop:   Sway (Wayland) + waybar, foot, fuzzel, mako, PipeWire
  Log:       $LOG

INFO
read -rp "Start? [Y/n] " a; [[ "${a:-y}" =~ ^[yYjJ] ]] || exit 0

# ---------- Step runner (skips finished steps) ----------
step() {   # step NAME function
    if [ -f "$DONE/$1" ]; then echo ">>> $1: already done, skipping"; return; fi
    echo; echo ">>> $1"
    "$2"
    touch "$DONE/$1"
}
EMERGE=(emerge --noreplace --quiet-build --verbose-conflicts)

s_sync() { emerge-webrsync; }

s_profile() {
    local cur
    cur=$(eselect profile show | tail -n1 | xargs)
    if [ "$cur" != "$PROFILE" ]; then
        echo "Profile is $cur -> setting $PROFILE"
        eselect profile set "$PROFILE"
    fi
    eselect profile show
}

s_binhost() {
    mkdir -p /etc/portage/binrepos.conf
    cat > /etc/portage/binrepos.conf/gentoobinhost.conf <<CONF
[gentoobinhost]
priority = 9999
sync-uri = https://distfiles.gentoo.org/releases/amd64/binpackages/23.0/$LEVEL/
CONF
    getuto
}

s_makeconf() {
    local mc=/etc/portage/make.conf
    grep -q '# --- setup.sh ---' "$mc" || cat >> "$mc" <<CONF

# --- setup.sh ---
MAKEOPTS="-j$JOBS -l$CPUS"
FEATURES="\${FEATURES} getbinpkg binpkg-request-signature"
VIDEO_CARDS="$VIDEO"
INPUT_DEVICES="libinput"
GRUB_PLATFORMS="efi-64"
ACCEPT_LICENSE="-* @FREE @BINARY-REDISTRIBUTABLE"
CONF
    mkdir -p /etc/portage/package.use
    "${EMERGE[@]}" --oneshot app-portage/cpuid2cpuflags
    echo "*/* $(cpuid2cpuflags)" > /etc/portage/package.use/00cpu-flags
}

s_locale() {
    ln -sf "../usr/share/zoneinfo/$TZONE" /etc/localtime
    printf '%s UTF-8\n' en_US.UTF-8 de_DE.UTF-8 "$SYSLANG" | sort -u > /etc/locale.gen
    locale-gen
    printf 'LANG="%s"\nLC_COLLATE="C.UTF-8"\n' "$SYSLANG" > /etc/env.d/02locale
    if [ "$INIT" = systemd ]; then
        # /etc/conf.d/keymaps belongs to OpenRC and does not exist here
        printf 'KEYMAP=%s\n' "$CONSKBD" > /etc/vconsole.conf
        printf 'LANG=%s\n'   "$SYSLANG" > /etc/locale.conf
    else
        sed -i "s/^keymap=.*/keymap=\"$CONSKBD\"/" /etc/conf.d/keymaps
    fi
    env-update
    # Handbook: pick up the new environment right away. /etc/profile is not
    # written for "set -eu", so relax both while sourcing it.
    set +eu
    # shellcheck disable=SC1091
    . /etc/profile
    set -eu
}

s_world() {   # bring the stage3 up to date (mostly binaries)
    emerge --update --deep --newuse --quiet-build @world
}

s_kernel() {
    echo "sys-kernel/installkernel grub dracut" > /etc/portage/package.use/installkernel
    # btrfs-progs MUST be here, before gentoo-kernel-bin triggers dracut:
    # dracut's 90btrfs module starts with "require_binaries btrfs || return 1",
    # so without it the module is skipped and the initramfs gets no btrfs
    # tooling or udev rules. Root is btrfs, so install it first.
    "${EMERGE[@]}" sys-fs/btrfs-progs
    local pk=(sys-kernel/linux-firmware sys-kernel/gentoo-kernel-bin)
    if [ "$INTEL_CPU" = yes ]; then pk+=(sys-firmware/intel-microcode); fi
    "${EMERGE[@]}" "${pk[@]}"
}

s_system() {
    echo "$HOSTNAME" > /etc/hostname
    # Packages needed on both init systems (btrfs-progs is already in s_kernel)
    local pk=(sys-process/cronie net-misc/networkmanager sys-fs/dosfstools
              app-admin/sudo app-shells/fish sys-apps/dbus)
    if [ "$INIT" = openrc ]; then
        # systemd covers these itself: journald, timesyncd, logind
        pk+=(app-admin/sysklogd net-misc/chrony sys-auth/elogind)
    fi
    "${EMERGE[@]}" "${pk[@]}"

    if [ "$INIT" = openrc ]; then
        echo "hostname=\"$HOSTNAME\"" > /etc/conf.d/hostname
        rc-update add elogind boot
        local s
        for s in dbus NetworkManager sysklogd cronie chronyd; do rc-update add "$s" default; done
    else
        # systemd detects the chroot and would silently ignore "enable"
        # ("Running in chroot, ignoring request") - this env var overrides that.
        SYSTEMD_IGNORE_CHROOT=1 systemctl enable \
            NetworkManager.service cronie.service systemd-timesyncd.service
    fi

    mkdir -p /etc/sudoers.d
    echo '%wheel ALL=(ALL:ALL) ALL' > /etc/sudoers.d/wheel
    chmod 440 /etc/sudoers.d/wheel
}

s_desktop() {
    echo "media-video/pipewire sound-server" > /etc/portage/package.use/pipewire
    "${EMERGE[@]}" gui-wm/sway gui-apps/swaybg gui-apps/swaylock gui-apps/swayidle \
        gui-apps/waybar gui-apps/foot gui-apps/fuzzel gui-apps/mako \
        gui-apps/grim gui-apps/slurp gui-apps/wl-clipboard \
        gui-libs/xdg-desktop-portal-wlr media-video/pipewire media-video/wireplumber \
        media-fonts/noto media-fonts/fontawesome
}

s_user() {
    local g groups=""
    for g in wheel audio video usb input users; do        # only groups that exist
        getent group "$g" >/dev/null && groups="$groups,$g"
    done
    local sh
    sh=$(command -v fish || echo /bin/bash)            # real path, not a guessed /bin/fish
    grep -qx "$sh" /etc/shells 2>/dev/null || echo "$sh" >> /etc/shells
    id "$USERNAME" >/dev/null 2>&1 || useradd -m -G "${groups#,}" -s "$sh" "$USERNAME"
    local h
    h=$(getent passwd "$USERNAME" | cut -d: -f6)

    # Sway config: stock config + German keyboard, fuzzel, waybar, PipeWire, mako
    mkdir -p "$h/.config/sway" "$h/.config/fish/conf.d"
    if [ ! -f "$h/.config/sway/config" ]; then
        # shellcheck disable=SC2016  # \$term/\$menu are sway variables, not shell
        awk '/^bar \{/ {skip=1} !skip {print} skip && /^\}/ {skip=0}' /etc/sway/config \
            | sed 's/^set \$term .*/set $term foot/; s/^set \$menu .*/set $menu fuzzel/' \
            > "$h/.config/sway/config"
        cat >> "$h/.config/sway/config" <<CONF

# --- setup.sh ---
input type:keyboard xkb_layout "$KBD"
bar { swaybar_command waybar }
exec gentoo-pipewire-launcher restart
exec mako
CONF
    fi

    # Start Sway automatically after login on tty1
    cat > "$h/.config/fish/conf.d/sway.fish" <<'CONF'
if status is-login; and test (tty) = /dev/tty1; and not set -q WAYLAND_DISPLAY
    exec dbus-run-session sway
end
CONF
    chown -R "$USERNAME:$USERNAME" "$h/.config"
}

s_boot() {
    "${EMERGE[@]}" sys-boot/grub sys-boot/efibootmgr
    if [ -d /sys/firmware/efi/efivars ]; then
        grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=Gentoo
    else
        echo "No EFI variables visible - installing to the fallback path only."
    fi
    # Fallback path \EFI\BOOT\BOOTX64.EFI: boots even if the NVRAM entry gets lost
    grub-install --target=x86_64-efi --efi-directory=/boot/efi --removable
    grub-mkconfig -o /boot/grub/grub.cfg
    grep -q 'rootflags=subvol=@' /boot/grub/grub.cfg && echo "OK: rootflags=subvol=@ found" \
        || echo "WARNING: rootflags=subvol=@ missing in grub.cfg"
}

step 01-sync     s_sync
step 02-profile  s_profile
step 03-binhost  s_binhost
step 04-makeconf s_makeconf
step 05-locale   s_locale
step 06-world    s_world
step 07-kernel   s_kernel
step 08-system   s_system
step 09-desktop  s_desktop
step 10-user     s_user
step 11-boot     s_boot

# ---------- Passwords (repeat until they work) ----------
echo; echo ">>> Password for root"
until passwd root; do echo "Try again."; done
echo; echo ">>> Password for $USERNAME"
until passwd "$USERNAME"; do echo "Try again."; done

cat <<DONEMSG

=== Setup finished ===
Next:  exit   (leave the chroot; mounts are cleaned up)
       umount -R /mnt/gentoo && reboot
Then log in as $USERNAME on tty1 - Sway starts automatically.
  Super+Enter  terminal (foot)      Super+d  launcher (fuzzel)
  Super+Shift+q close window        Super+Shift+e exit Sway
  Wi-Fi: nmtui
DONEMSG
