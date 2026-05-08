function xrar -d "extract all rar files and update video timestamps"
    if not command -v unrar &>/dev/null
        echo "Error: unrar command not found"
        return 1
    end

    mkdir -p rar
    set -l rar_files *.rar

    if not test -f $rar_files[1]
        echo "No .rar files found"
        rm -r rar
        return 0
    end

    for r in $rar_files
        if string match -q "*.part*" $r
            continue
        end

        echo "+-------------------------+"
        echo "| $r |"
        echo "+-------------------------+"

        cd rar
        mv "../$r" . -v
        unrar e "$r"
        find . -type f \( -iname "*.mp4" -o -iname "*.avi" \) -exec touch -m {} \; -exec mv {} .. \;
        cd ..
    end

    rm -r rar
end
