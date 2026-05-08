function upgentoo -d "update Gentoo: mount boot, sync, emerge world"
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
end
