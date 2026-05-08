function p -d "play last 10 modified video files"
    if not command -v eza &>/dev/null
        echo "Error: eza not found"
        return 1
    end

    if not command -v mpv &>/dev/null
        echo "Error: mpv not found"
        return 1
    end

    # Store output in a temporary file to check if empty and preserve spaces
    set -l temp_file (mktemp)
    eza -smodified -L1 -r *.mp* 2>/dev/null | head -10 > $temp_file

    if test ! -s $temp_file
        echo "No video files found"
        rm $temp_file
        return 0
    end

    # Read filenames line by line, strip eza's quotes, and play
    while read -l f
        # Strip leading and trailing single quotes that eza adds
        set f (string trim -c "'" "$f")
        mpv "$f"
    end < $temp_file

    rm $temp_file
end
