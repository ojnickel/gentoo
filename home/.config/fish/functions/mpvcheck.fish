function mpvcheck --description "Play video files with mpv, ask to delete on error"
    argparse 'n=limit' 's=sort' -- $argv
    or return 1

    # Handle Ctrl+C cleanly
    function __mpvcheck_interrupt --on-signal INT
        echo -e "\n🔴 Aborted by user (Ctrl+C)"
        exit 130
    end

    # Determine sort method (default = time)
    switch $_flag_sort
        case s
            set files (fd . -e mp4 -e mkv -e webm -0 | xargs -0 stat --printf "%s %n\n" | sort -nr | cut -d' ' -f2-)
        case r
            set files (fd . -e mp4 -e mkv -e webm | sort --random-sort)
        case t ''
            set files (fd . -e mp4 -e mkv -e webm -0 | xargs -0 stat --printf "%Y %n\n" | sort -nr | cut -d' ' -f2-)
        case '*'
            echo "❌ Unknown sort mode: $_flag_sort (use t, s, or r)"
            return 1
    end

    # Handle limit
    set limit 10
    if set -q _flag_limit
        if test "$_flag_limit" = "all"
            set limit (count $files)
        else if string match -qr '^\d+$' -- $_flag_limit
            set limit $_flag_limit
        else
            echo "❌ Invalid value for -n: must be number or 'all'"
            return 1
        end
    end

    # Slice file list
    set files $files[1..$limit]

    # Loop through files
    for f in $files
        echo ""
        echo -e "▶ Playing: $f\n"
        mpv "$f"
        if test $status -ne 0
            echo -e "\n❌ mpv failed on: $f"
            read -P "🗑️ Delete this file? [y/N]: " confirm
            switch $confirm
                case y Y
                    rm -v "$f"
            end
        end
    end
end

