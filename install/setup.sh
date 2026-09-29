#!/bin/bash
# Gentoo base setup INSIDE the chroot: binhost, make.conf, locale, kernel, services,
# user, optional Sway (Wayland) desktop, GRUB. Asks everything at the start,
# then runs alone. Init system and root filesystem are detected, not assumed.
# Safe to re-run: finished steps are skipped (markers in /var/lib/setup.sh/).
#
# Usage (in the chroot):  bash /root/setup.sh
#
# Personal defaults come from install/.env, which is tracked (see env.example).
# Every answer can also be preset in the environment, which wins over the file:
#   CFG_HOSTNAME  CFG_USER  CFG_TZONE  CFG_LANG  CFG_KBD  CFG_CONSKBD
#   CFG_SHELL (bash|fish|zsh)  CFG_DESKTOP (sway|none)  CFG_PROFILE (plain|desktop)
#   CFG_ROOT_PW  CFG_USER_PW  UNATTENDED=1
# e.g.  CFG_HOSTNAME=box CFG_USER=bob CFG_DESKTOP=none bash /root/setup.sh
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

# ---------- Personal defaults live in .env, not in this script ----------
# install/.env is tracked in git, so a fresh clone already has hostname,
# user, locale and keyboard filled in (see env.example for every option).
# Its values are offered as prompt defaults and can be typed over; a
# variable set in the environment wins for a single run. Passwords are
# deliberately empty there, so they get asked for instead.
# With no .env at all, every personal field starts empty and is asked for.
# Search order: $SETUP_ENV, /root/.env (copied in by chroot.sh),
# .env next to this script, then ~/.env.
if [ -z "${SETUP_ENV:-}" ]; then
    for c in /root/.env "$(dirname "$0")/.env" "${HOME:-/root}/.env"; do
        if [ -f "$c" ]; then SETUP_ENV=$c; break; fi
    done
fi
CFG_VARS=(CFG_HOSTNAME CFG_USER CFG_TZONE CFG_LANG CFG_KBD CFG_CONSKBD
          CFG_SHELL CFG_DESKTOP CFG_PROFILE CFG_ROOT_PW CFG_USER_PW UNATTENDED)

if [ -n "${SETUP_ENV:-}" ] && [ -f "$SETUP_ENV" ]; then
    echo "Loading personal defaults from $SETUP_ENV"
    # Remember what the environment already set. The file is sourced after it,
    # so without this its empty assignments would wipe a value passed for this
    # run only. An explicit variable beats the stored default.
    declare -A _from_env=()
    for v in "${CFG_VARS[@]}"; do
        if [ -n "${!v:-}" ]; then _from_env[$v]=${!v}; fi
    done
    set -a
    # shellcheck disable=SC1090  # path is chosen at runtime
    . "$SETUP_ENV"
    set +a
    for v in "${!_from_env[@]}"; do printf -v "$v" '%s' "${_from_env[$v]}"; done
    unset _from_env
else
    SETUP_ENV=""
    echo "No .env found - personal fields start empty (see env.example)."
fi

# ---------- Questions ----------
# A CFG_ value already set (from .env or the environment) is offered as
# the default; UNATTENDED=1 accepts it without asking. Fields with no default
# must be typed in - empty is refused. The CFG_ prefix keeps these clear of
# HOSTNAME and SHELL, which bash and the login environment already define.
ask() {   # ask VAR "Question" [fallback-default]
    local var=$1 q=$2 def=${!1:-} a=""
    [ -n "$def" ] || def=${3:-}                  # .env wins over the fallback
    if [ -n "$def" ] && [ "${UNATTENDED:-}" = 1 ]; then
        printf '%s: %s   (unattended)\n' "$q" "$def"
        printf -v "$var" '%s' "$def"
        return
    fi
    while :; do
        if [ -n "$def" ]; then
            read -rp "$q [$def]: " a || true
            a=${a:-$def}
        else
            read -rp "$q: " a || true
        fi
        [ -n "$a" ] && break
        echo "  This field cannot be empty."
    done
    printf -v "$var" '%s' "$a"
}
echo "=== Gentoo setup - press Enter to accept the value in [brackets] ==="
ask CFG_HOSTNAME "Hostname"
ask CFG_USER     "User name"
ask CFG_TZONE    "Time zone (e.g. Europe/Berlin)"
ask CFG_LANG     "System language (e.g. de_DE.UTF-8)"
ask CFG_KBD      "Keyboard layout (xkb, e.g. de)"
ask CFG_CONSKBD  "Console keymap (e.g. de-latin1-nodeadkeys)"
# These are choices from a fixed list, not personal data, so they keep
# working fallbacks when .env says nothing.
ask CFG_SHELL    "Login shell (bash, fish, zsh)"  bash
ask CFG_DESKTOP  "Desktop (sway, none)"           sway
# The binary host is built against the PLAIN profile. The desktop profile flips
# USE flags globally, so most binary packages stop matching and get compiled
# from source instead - hours rather than minutes. Sway does not need it.
ask CFG_PROFILE  "Profile: 'plain' (matches binhost, fast) or 'desktop'" plain

[[ "$CFG_USER" =~ ^[a-z_][a-z0-9_-]*$ ]] || { echo "Invalid user name."; exit 1; }
[ -e "/usr/share/zoneinfo/$CFG_TZONE" ] || { echo "Unknown time zone $CFG_TZONE."; exit 1; }
case "$CFG_PROFILE" in plain|desktop) ;; *) echo "Profile must be plain or desktop."; exit 1 ;; esac
case "$CFG_DESKTOP" in sway|none) ;;    *) echo "Desktop must be sway or none."; exit 1 ;; esac
case "$CFG_SHELL"   in bash|fish|zsh) ;; *) echo "Shell must be bash, fish or zsh."; exit 1 ;; esac

# ---------- Detect the init system of the extracted stage3 ----------
# tui.sh offers systemd stage3 variants, so nothing here may assume OpenRC.
if [ -x /usr/lib/systemd/systemd ]; then INIT=systemd; else INIT=openrc; fi

# ---------- Detect the root filesystem, so the right tools get installed ----------
ROOTFS=$(findmnt -no FSTYPE / || echo unknown)
case "$ROOTFS" in
    btrfs) FSPKG=sys-fs/btrfs-progs ;;
    ext2|ext3|ext4) FSPKG=sys-fs/e2fsprogs ;;
    xfs)   FSPKG=sys-fs/xfsprogs ;;
    f2fs)  FSPKG=sys-fs/f2fs-tools ;;
    *)     FSPKG="" ; echo "WARNING: unknown root filesystem '$ROOTFS', installing no extra tools" ;;
esac

# Profile must match BOTH the init system and the desktop choice.
# All four combinations exist as real profiles in profiles.desc.
PROFILE=default/linux/amd64/23.0
if [ "$CFG_PROFILE" = desktop ]; then PROFILE=$PROFILE/desktop; fi
if [ "$INIT" = systemd ];        then PROFILE=$PROFILE/systemd; fi

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

if [ "$CFG_DESKTOP" = sway ]; then
    DESKTOP_DESC="Sway (Wayland) + waybar, foot, fuzzel, mako, PipeWire"
else
    DESKTOP_DESC="none (console only)"
fi

cat <<INFO

  Hostname:  $CFG_HOSTNAME        User: $CFG_USER ($CFG_SHELL)
  Time zone: $CFG_TZONE    Language: $CFG_LANG    Keyboard: $CFG_KBD / $CFG_CONSKBD
  Init:      $INIT (detected from the stage3)
  Root FS:   $ROOTFS${FSPKG:+  -> $FSPKG}
  Profile:   $PROFILE
  CPU:       $CPUS threads, $MEM_GB GB RAM -> MAKEOPTS -j$JOBS, binhost $LEVEL
  GPU:       VIDEO_CARDS="$VIDEO"
  Desktop:   $DESKTOP_DESC
  Log:       $LOG

INFO
if [ "${UNATTENDED:-}" = 1 ]; then
    echo "UNATTENDED=1 - starting without asking."
else
    read -rp "Start? [Y/n] " a; [[ "${a:-y}" =~ ^[yYjJ] ]] || exit 0
fi

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
    ln -sf "../usr/share/zoneinfo/$CFG_TZONE" /etc/localtime
    # en_US.UTF-8 stays as a fallback that tools can always rely on
    printf '%s UTF-8\n' en_US.UTF-8 "$CFG_LANG" | sort -u > /etc/locale.gen
    locale-gen
    printf 'LANG="%s"\nLC_COLLATE="C.UTF-8"\n' "$CFG_LANG" > /etc/env.d/02locale
    if [ "$INIT" = systemd ]; then
        # /etc/conf.d/keymaps belongs to OpenRC and does not exist here
        printf 'KEYMAP=%s\n' "$CFG_CONSKBD" > /etc/vconsole.conf
        printf 'LANG=%s\n'   "$CFG_LANG" > /etc/locale.conf
    else
        sed -i "s/^keymap=.*/keymap=\"$CFG_CONSKBD\"/" /etc/conf.d/keymaps
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
    # The filesystem tools MUST be here, before gentoo-kernel-bin triggers
    # dracut. Dracut's modules check for their userspace tool first (90btrfs
    # starts with "require_binaries btrfs || return 1"), so without it the
    # module is skipped and the initramfs gets no tooling or udev rules.
    if [ -n "$FSPKG" ]; then "${EMERGE[@]}" "$FSPKG"; fi
    local pk=(sys-kernel/linux-firmware sys-kernel/gentoo-kernel-bin)
    if [ "$INTEL_CPU" = yes ]; then pk+=(sys-firmware/intel-microcode); fi
    "${EMERGE[@]}" "${pk[@]}"
}

s_system() {
    echo "$CFG_HOSTNAME" > /etc/hostname
    # Packages needed on both init systems (the root FS tools are in s_kernel)
    local pk=(sys-process/cronie net-misc/networkmanager sys-fs/dosfstools
              app-admin/sudo sys-apps/dbus)
    case "$CFG_SHELL" in
        fish) pk+=(app-shells/fish) ;;
        zsh)  pk+=(app-shells/zsh) ;;
        bash) ;;                        # already in the stage3
    esac
    if [ "$INIT" = openrc ]; then
        # systemd covers these itself: journald, timesyncd, logind
        pk+=(app-admin/sysklogd net-misc/chrony sys-auth/elogind)
    fi
    "${EMERGE[@]}" "${pk[@]}"

    if [ "$INIT" = openrc ]; then
        echo "hostname=\"$CFG_HOSTNAME\"" > /etc/conf.d/hostname
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
    if [ "$CFG_DESKTOP" != sway ]; then echo "Desktop 'none' - nothing to install"; return; fi
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
    sh=$(command -v "$CFG_SHELL" || echo /bin/bash)    # real path, not a guessed one
    grep -qx "$sh" /etc/shells 2>/dev/null || echo "$sh" >> /etc/shells
    id "$CFG_USER" >/dev/null 2>&1 || useradd -m -G "${groups#,}" -s "$sh" "$CFG_USER"
    local h
    h=$(getent passwd "$CFG_USER" | cut -d: -f6)

    if [ "$CFG_DESKTOP" = sway ]; then
        # Stock sway config, minus its built-in bar, with the chosen keyboard
        mkdir -p "$h/.config/sway"
        if [ ! -f "$h/.config/sway/config" ]; then
            # shellcheck disable=SC2016  # \$term/\$menu are sway variables, not shell
            awk '/^bar \{/ {skip=1} !skip {print} skip && /^\}/ {skip=0}' /etc/sway/config \
                | sed 's/^set \$term .*/set $term foot/; s/^set \$menu .*/set $menu fuzzel/' \
                > "$h/.config/sway/config"
            cat >> "$h/.config/sway/config" <<CONF

# --- setup.sh ---
input type:keyboard xkb_layout "$CFG_KBD"
bar { swaybar_command waybar }
exec gentoo-pipewire-launcher restart
exec mako
CONF
        fi
        autostart_sway "$h"
    fi
    chown -R "$CFG_USER:$CFG_USER" "$h"
}

# Start Sway automatically after logging in on tty1, in the user's login shell
autostart_sway() {
    local h=$1
    case "$CFG_SHELL" in
        fish)
            mkdir -p "$h/.config/fish/conf.d"
            cat > "$h/.config/fish/conf.d/sway.fish" <<'CONF'
if status is-login; and test (tty) = /dev/tty1; and not set -q WAYLAND_DISPLAY
    exec dbus-run-session sway
end
CONF
            ;;
        bash|zsh)
            # bash reads .bash_profile, zsh reads .zprofile, for login shells
            local f=$h/.bash_profile
            [ "$CFG_SHELL" = zsh ] && f=$h/.zprofile
            grep -q 'dbus-run-session sway' "$f" 2>/dev/null || cat >> "$f" <<'CONF'

# --- setup.sh: start Sway on tty1 ---
if [ -z "${WAYLAND_DISPLAY:-}" ] && [ "$(tty)" = /dev/tty1 ]; then
    exec dbus-run-session sway
fi
CONF
            ;;
    esac
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
    # Only a btrfs root lives in a subvolume, so only it needs rootflags
    if [ "$ROOTFS" = btrfs ]; then
        grep -q 'rootflags=subvol=@' /boot/grub/grub.cfg && echo "OK: rootflags=subvol=@ found" \
            || echo "WARNING: rootflags=subvol=@ missing in grub.cfg"
    fi
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
# ---------- Passwords ----------
# CFG_ROOT_PW / CFG_USER_PW may come from .env. A value starting with '$'
# is treated as an already-hashed password and handed to "chpasswd -e", so the
# file never has to hold a plaintext one. Neither form is echoed: the value
# goes down a pipe into chpasswd, never to stdout, so it stays out of $LOG.
set_pw() {   # set_pw ACCOUNT VALUE
    local acct=$1 val=$2
    case "$val" in
        # A crypt hash has the shape $id$salt$digest.
        \$*\$*\$*) printf '%s:%s\n' "$acct" "$val" | chpasswd -e ;;
        # Starts with '$' but is not that shape: almost certainly written
        # unquoted in .env, where bash expanded $id away.
        \$*) echo "ERROR: the password for $acct looks like a damaged hash."
             echo "Hashes must be in SINGLE quotes in .env, e.g."
             echo "    CFG_ROOT_PW='\$6\$salt\$digest...'"
             exit 1 ;;
        *)   printf '%s:%s\n' "$acct" "$val" | chpasswd ;;
    esac
}

if [ -n "${CFG_ROOT_PW:-}" ]; then
    set_pw root "$CFG_ROOT_PW"; echo ">>> Password for root taken from .env"
else
    echo; echo ">>> Password for root"
    until passwd root; do echo "Try again."; done
fi
if [ -n "${CFG_USER_PW:-}" ]; then
    set_pw "$CFG_USER" "$CFG_USER_PW"; echo ">>> Password for $CFG_USER taken from .env"
else
    echo; echo ">>> Password for $CFG_USER"
    until passwd "$CFG_USER"; do echo "Try again."; done
fi

# The config may hold a password, so the COPY inside the chroot must not stay
# on the installed system. Only /root/.env is removed - that is the throwaway
# chroot.sh made. A .env reached through $SETUP_ENV or found in the repo is
# the original and is left alone. This runs only after every step succeeded,
# so re-runs after a failure still find their defaults.
if [ -n "${SETUP_ENV:-}" ] && [ "$SETUP_ENV" = /root/.env ]; then
    shred -u /root/.env 2>/dev/null || rm -f /root/.env
    echo "Removed /root/.env from the installed system."
fi

cat <<DONEMSG

=== Setup finished ===
Next:  exit   (leave the chroot; mounts are cleaned up)
       umount -R /mnt/gentoo && reboot
Then log in as $CFG_USER on tty1.
  Wi-Fi: nmtui
DONEMSG

if [ "$CFG_DESKTOP" = sway ]; then
    cat <<DONEMSG
Sway starts automatically on tty1.
  Super+Enter  terminal (foot)      Super+d  launcher (fuzzel)
  Super+Shift+q close window        Super+Shift+e exit Sway
DONEMSG
fi
