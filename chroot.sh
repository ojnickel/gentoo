#!/bin/env bash

#target 
tdir="$3"
idir="$2"
action="$1"

#check if  target exists
[ ! -d "$tdir" ] && mkdir "$tdir"  || echo "dir already exists"

rescue (){
    mount --rbind "${idir}"/var/db/repos/gentoo "$tdir"/var/db/repos/gentoo
    mount --rbind "$idir"/usr/portage/distfiles "$tdir"/usr/portage/distfiles
    mount --rbind "${idir}"/etc/portage "$tdir"/etc/portage
    mount --rbind "$idir"/usr/portage/binpkgs "$tdir"/usr/portage/binpkgs
}
mkroot (){
	#mount -o defaults,noatime,compress=lzo,autodefrag,subvol=gentoo_root /dev/nvme0n1p7 /mnt/gentoo
	mount --rbind /dev "$tdir"q/dev
	mount --make-rslave "$tdir"/dev
	mount -t proc /proc "$tdir"/proc
	mount --rbind /sys "$tdir"/sys
	mount --make-rslave "$tdir"/sys
	mount --rbind /tmp "$tdir"/tmp
	chroot "$tdir" /bin/bash
}

#actions
[ "$action" = "rescue" ] && rescue && mkroot 
[ "$action" = "chroot" ] && mkroot
