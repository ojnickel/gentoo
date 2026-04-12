function cutvi
    argparse 'h/help' 's/start=' 'e/end=' 'd/dir=' 'c/crop=' -- $argv
    or return 1

    if set -q _flag_help
        echo "Usage: cutvi [OPTIONS] INPUT OUTPUT"
        echo ""
        echo "  Cut a video at start and/or end."
        echo ""
        echo "Options:"
        echo "  -s, --start TIME  Start time, e.g. 00:01:30 (default: beginning)"
        echo "  -e, --end TIME    End time, e.g. 00:45:00 (default: end of file)"
        echo "  -d, --dir DIR     Directory for input/output (default: /mnt/samsung/admin)"
        echo "  -c, --crop W:H:X:Y  Crop to W×H starting at X,Y (e.g. 1280:720:0:0)"
        echo "  -h, --help        Show this help"
        return 0
    end

    set dir (test -n "$_flag_dir"; and echo $_flag_dir; or echo /mnt/samsung/admin)

    if test (count $argv) -lt 2
        echo "Error: INPUT and OUTPUT required."
        echo "Usage: cutvi [OPTIONS] INPUT OUTPUT"
        return 1
    end

    set input $dir/(string replace -r '\.mp4$' '' $argv[1]).mp4
    set output $dir/(string replace -r '\.mp4$' '' $argv[2]).mp4

    if not test -f $input
        echo "Error: $input not found."
        return 1
    end

    if test -f $output
        read -P "File $output already exists. Delete it? [y/N] " confirm
        if test "$confirm" = y -o "$confirm" = Y
            rm $output
        else
            echo "Aborted."
            return 1
        end
    end

    set time_args ""
    if test -n "$_flag_start"
        set time_args "$time_args -ss $_flag_start"
    end
    if test -n "$_flag_end"
        set time_args "$time_args -to $_flag_end"
    end

    if test -n "$_flag_crop"
        eval ffmpeg -i $input $time_args -vf crop=$_flag_crop $output
    else
        eval ffmpeg -i $input $time_args -c copy $output
    end
end
