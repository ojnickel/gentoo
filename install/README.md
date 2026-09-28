# Gentoo UEFI installer scripts

Scripted Gentoo install for amd64/UEFI, following the official
[Handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64). Partitions a disk,
verifies and unpacks a stage3, chroots in and builds a working system with a
distribution kernel and GRUB.

Runs from the Gentoo live ISO or from any other live system with the usual
tools — SystemRescue works, and the scripts fall back to fetching the Gentoo
release key over WKD when the ISO's local keyring is not present.

**These scripts erase an entire disk. Read the summary they print before
confirming.**

## Requirements

- Booted in **UEFI** mode (`/sys/firmware/efi` must exist)
- Root privileges
- Network
- Live system tools: `sgdisk`, `wipefs`, `partprobe`, `mkfs.vfat`, `mkswap`,
  `blkid`, `gpg`, `tar`, `xz`, plus `mkfs.` for the filesystem you pick
  (each script checks and names anything missing before touching the disk)

## Quick start

Guided, menu-driven — easiest:

```sh
./tui.sh
```

Or non-interactive:

```sh
./install.sh nvme0n1                 # btrfs root, openrc stage3
FS=ext4 ./install.sh sda systemd     # ext4 root, systemd stage3
```

Then, inside the chroot that opens at the end:

```sh
bash /root/setup.sh
```

## The scripts

| Script | Does |
|---|---|
| `tui.sh` | Menu front end for everything below (`dialog`, `whiptail`, or plain text) |
| `install.sh` | Runs `disk.sh` → `stage3.sh` → `chroot.sh` in order |
| `disk.sh` | GPT partitioning, filesystem, mounts, generates the fstab |
| `stage3.sh` | Downloads, **GPG-verifies** and extracts the stage3 |
| `chroot.sh` | Mounts `/proc` `/sys` `/dev` `/run`, chroots in, cleans up on exit |
| `setup.sh` | Everything inside the chroot: profile, kernel, services, user, GRUB |

Each runs standalone, so you can resume after a failure instead of starting
over:

```sh
./stage3.sh openrc
./chroot.sh chroot /mnt/gentoo
```

## disk.sh

```sh
./disk.sh DISK        # e.g. ./disk.sh sda   or   ./disk.sh nvme0n1
```

Layout: partition 1 EFI, partition 2 swap (unless disabled), last partition
root. NVMe/eMMC `p` suffixes are handled automatically.

| Variable | Default | Meaning |
|---|---|---|
| `FS` | `btrfs` | Root filesystem: `btrfs`, `ext4`, `xfs` |
| `DATA` | `dup` | Btrfs data profile: `dup` or `single` (btrfs only) |
| `EFI_SIZE` | `1G` | EFI system partition size |
| `SWAP_SIZE` | `8G` | Swap partition size, `0` for none |
| `LABEL` | `gentoo` | Root filesystem label |
| `MNT` | `/mnt/gentoo` | Mountpoint for the new system |
| `CONFIRM` | *(unset)* | `YES` skips the interactive confirmation |

With **btrfs** you also get subvolumes `@` (`/`), `@home` and `@snapshots`,
mounted with `noatime,compress=zstd:3`. `ext4` and `xfs` are created as a
single plain filesystem; only ext4 gets a boot-time fsck pass in the fstab.

```sh
FS=xfs SWAP_SIZE=0 ./disk.sh nvme0n1
```

## stage3.sh

```sh
./stage3.sh [VARIANT]     # openrc (default), systemd, desktop-openrc, ...
```

The tarball's signature must chain to the Gentoo release key
`13EBBDBE DE7A1277 5DFDB1BA BB572E0E 2D182910` — the signing subkey is checked
back to that primary key, so a valid signature from some *other* key in the
keyring is rejected. The `latest-stage3` list is verified before it is parsed.
Cross-check the fingerprint at
<https://www.gentoo.org/downloads/signatures/>.

## setup.sh

Runs **inside the chroot**. `chroot.sh` copies it to `/root/setup.sh` for you.

It detects the init system (OpenRC or systemd) from the extracted stage3 and
the root filesystem from the mount, then picks the matching profile, service
manager, keymap file and filesystem tools. It is safe to re-run: finished
steps are marked in `/var/lib/setup.sh/` and skipped. Full log in
`/var/log/setup.log`.

Everything it asks can be preset in the environment for an unattended run:

| Variable | Default | Meaning |
|---|---|---|
| `CFG_HOSTNAME` | `gentoo` | Hostname |
| `CFG_USER` | `user` | Login account to create (added to `wheel`) |
| `CFG_TZONE` | `UTC` | Time zone, e.g. `Europe/Berlin` |
| `CFG_LANG` | `en_US.UTF-8` | System locale |
| `CFG_KBD` | `us` | X/Wayland keyboard layout |
| `CFG_CONSKBD` | `us` | Console keymap |
| `CFG_SHELL` | `bash` | Login shell: `bash`, `fish`, `zsh` |
| `CFG_DESKTOP` | `sway` | `sway` or `none` (console only) |
| `CFG_PROFILE` | `plain` | `plain` or `desktop` — see below |

```sh
CFG_HOSTNAME=box CFG_USER=bob CFG_DESKTOP=none bash /root/setup.sh
```

### plain vs desktop profile

The official binary host is built against the **plain** profile. The desktop
profile changes USE flags globally, so most binary packages stop matching and
get compiled from source — hours instead of minutes. Sway does not need the
desktop profile, so `plain` is the default. Pick `desktop` only if you want
its defaults and have the time.

Note that `cpuid2cpuflags` still writes your CPU's native `CPU_FLAGS_X86`,
which invalidates some binary packages regardless. "Binary host" never means
zero compiling.

### What it installs

A distribution kernel (`gentoo-kernel-bin`) with dracut and GRUB, microcode on
Intel, NetworkManager, cronie, sudo, and the tools for your root filesystem.
On OpenRC it adds sysklogd, chrony and elogind; systemd covers those itself.
With `CFG_DESKTOP=sway` you additionally get Sway, waybar, foot, fuzzel, mako,
PipeWire and fonts, plus an autostart snippet for tty1 in your login shell.

## Notes and deviations from the handbook

- The EFI system partition is mounted at **`/boot/efi`**, not the handbook's
  newer `/efi`. Both are supported by GRUB; this only changes where the ESP
  appears.
- `/boot` lives on the root filesystem, so GRUB reads the kernel from it. With
  btrfs that relies on GRUB's btrfs and zstd support (fine on GRUB 2.12).
- GRUB is installed twice on purpose: once as an NVRAM entry, once to the
  removable fallback path `\EFI\BOOT\BOOTX64.EFI`, so the machine still boots
  if the firmware loses its boot entry.

## Troubleshooting

**`/boot/efi is not mounted`** — `setup.sh` checks this up front rather than
failing after an hour of compiling. From the live system:

```sh
mount /dev/<disk>1 /mnt/gentoo/boot/efi     # NVMe: /dev/nvme0n1p1
```

**Re-running after a failure** — `setup.sh` skips completed steps. To redo
one, delete its marker:

```sh
rm /var/lib/setup.sh/07-kernel
```

**Signature check failed** — usually a wrong system clock, since TLS and GPG
both depend on it. `stage3.sh` prints the date it is working with; fix it and
run again.
