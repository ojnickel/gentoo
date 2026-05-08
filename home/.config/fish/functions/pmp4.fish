function pmp4 -d "play all mp4 files sorted by size"
    if not command -v eza &>/dev/null
        echo "Error: eza not found"
        return 1
    end

    if not command -v mpv &>/dev/null
        echo "Error: mpv not found"
        return 1
    end

    set -l mp4_files (eza -L1 -ssize -r *.mp4 2>/dev/null)
    if test -z "$mp4_files"
        echo "No .mp4 files found"
        return 0
    end

    for f in $mp4_files
        mpv "$f"
    end
end
