function upgentoo -d "full Gentoo upgrade: mount, sync, emerge, grub, cleanup"
    if not mountpoint -q /boot
        echo "mounting boot..."
        mount /boot
    end
    if not mountpoint -q /boot/efi
        echo "mounting EFI..."
        mount /boot/efi
    end
    echo "updating package DB..."
    eix-sync
    echo "updating OS..."
    emerge -uavDN world
    echo "updating boot menu..."
    grub-mkconfig -o /boot/grub/grub.cfg
    echo "cleaning up..."
    emerge -c
    eclean -d distfiles
end
