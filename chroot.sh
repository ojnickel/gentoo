#!/bin/env bash

#target 
tdir="$3"
idir="$2"
action="$1"

#check if  target exists

rescue (){
    mount --rbind "${idir}"usr/portage/binpkgs "$tdir"/usr/portage/binpkgs
    mount --bind "${idir}"etc/portage "$tdir"/etc/portage
    mount --bind "$idir"usr/portage "$tdir"/usr/portage
}
mkroot (){
	#mount -o defaults,noatime,compress=lzo,autodefrag,subvol=gentoo_root /dev/nvme0n1p7 /mnt/gentoo
	mount --rbind /dev "$tdir"/dev
	mount --make-rslave "$tdir"/dev
	mount -t proc /proc "$tdir"/proc
	mount --rbind /sys "$tdir"/sys
	mount --make-rslave "$tdir"/sys
	mount --rbind /tmp "$tdir"/tmp
	chroot "$tdir" /bin/bash
}

#######actions
[ "$action" = "rescue" ] && rescue && mkroot 
[ "$action" = "chroot" ] && mkroot
