function screc
    argparse 'h/help' 's/sleep=' 'e/end=' 'n/name=' 'd/dir=' 'a/audio=' 'w/workspace=' 'r/region=' 'p/points=' 'x/pick' -- $argv
    or return 1

    if set -q _flag_help
        echo "Usage: screc [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  -s, --sleep SEC   Delay before recording starts (default: 5)"
        echo "  -e, --end TIME    Stop after TIME, e.g. 01:30:00 (default: Ctrl+C)"
        echo "  -n, --name NAME   Base name for output, auto-incremented (default: vid)"
        echo "  -d, --dir DIR     Output directory (default: /mnt/samsung/admin)"
        echo "  -a, --audio SRC   Pulse audio source (default: hdmi monitor)"
        echo "  -w, --workspace N Switch to workspace N immediately (default: 3)"
        echo "  -r, --region R    Record region: 'center' for 1280x720 centered, or WxH:X:Y"
        echo "  -p, --points C    Top-left and bottom-right: X1,Y1,X2,Y2"
        echo "  -x, --pick        Interactively pick region with mouse"
        echo "  -h, --help        Show this help"
        return 0
    end

    # --- defaults ---
    set sleep_time (test -n "$_flag_sleep"; and echo $_flag_sleep; or echo 5)
    set dir (test -n "$_flag_dir"; and echo $_flag_dir; or echo /mnt/samsung/admin)
    set audio (test -n "$_flag_audio"; and echo $_flag_audio; or echo alsa_output.pci-0000_00_1f.3.hdmi-stereo.monitor)
    set workspace (test -n "$_flag_workspace"; and echo $_flag_workspace; or echo 3)

    # --- output filename ---
    # if -n given: try plain name.mp4, then name-1.mp4, name-2.mp4, ...
    # if no -n:    always use vid-1.mp4, vid-2.mp4, ...
    set base (test -n "$_flag_name"; and echo $_flag_name; or echo vid)
    if test -n "$_flag_name"
        if not test -f $dir/$base.mp4
            set filename $dir/$base.mp4
        else
            set i 1
            while test -f $dir/$base-$i.mp4
                set i (math $i + 1)
            end
            set filename $dir/$base-$i.mp4
        end
    else
        set i 1
        while test -f $dir/$base-$i.mp4
            set i (math $i + 1)
        end
        set filename $dir/$base-$i.mp4
    end

    # --- optional duration limit for ffmpeg (-t flag) ---
    # accepts mm:ss (expands to 00:mm:ss) or hh:mm:ss (passed as-is)
    set end_arg ""
    if test -n "$_flag_end"
        set colon_count (string match -a ':' $_flag_end | count)
        if test $colon_count -eq 1
            set end_arg "-t 00:$_flag_end"
        else
            set end_arg "-t $_flag_end"
        end
    end

    # switch workspace immediately, then wait before recording
    xdotool key super+$workspace
    echo "Starting in $sleep_time seconds..."
    sleep $sleep_time

    # --- region selection ---
    # builds the ffmpeg -video_size / -i arguments for x11grab
    set region_arg ""
    if set -q _flag_pick
        # interactive: use xdotool to read mouse position at two corners
        echo "Move mouse to top-left corner, then press any key..."
        read -n1 --silent
        set tl (xdotool getmouselocation)   # output: "x:NNN y:NNN screen:0 window:NNN"
        set x1 (string replace -r '.*x:(\d+).*' '$1' $tl)
        set y1 (string replace -r '.*y:(\d+).*' '$1' $tl)
        echo "Top-left: $x1,$y1"
        echo "Move mouse to bottom-right corner, then press any key..."
        read -n1 --silent
        set br (xdotool getmouselocation)
        set x2 (string replace -r '.*x:(\d+).*' '$1' $br)
        set y2 (string replace -r '.*y:(\d+).*' '$1' $br)
        echo "Bottom-right: $x2,$y2"
        set w (math $x2 - $x1)
        set h (math $y2 - $y1)
        set region_arg "-video_size "$w"x"$h" -i :0.0+$x1,$y1"
    else if test -n "$_flag_points"
        # manual corners as X1,Y1,X2,Y2 — compute width/height from them
        set pts (string split , $_flag_points)
        set x1 $pts[1]; set y1 $pts[2]; set x2 $pts[3]; set y2 $pts[4]
        set w (math $x2 - $x1)
        set h (math $y2 - $y1)
        set region_arg "-video_size "$w"x"$h" -i :0.0+$x1,$y1"
    else if test -n "$_flag_region"
        if test "$_flag_region" = center
            # shorthand: 1280x720 centered on 1920x1080 (offset 320,180)
            set region_arg "-video_size 1280x720 -i :0.0+320,180"
        else
            # explicit WxH:X:Y format
            set parts (string split : $_flag_region)
            set region_arg "-video_size $parts[1] -i :0.0+$parts[2],$parts[3]"
        end
    else
        # no region flag: record the full screen
        set region_arg "-i :0.0"
    end

    # --- record ---
    echo "Recording to $filename"
    set start_time (date +%s)
    eval ffmpeg -f x11grab $region_arg -f pulse -i $audio -c:v libx264 $end_arg $filename
    set ffmpeg_status $status

    # compute and print duration
    set duration (math (date +%s) - $start_time)
    set mins (math -s0 $duration / 60)
    set secs (math $duration % 60)
    echo "Saved: $filename ($mins:$(printf '%02d' $secs))"

    # if ffmpeg exited with an error (e.g. Ctrl+C), offer to delete the partial file
    if test $ffmpeg_status -ne 0
        read -l -P "Delete $filename? [y/N] " confirm
        if test "$confirm" = y -o "$confirm" = Y
            rm $filename
            echo "Deleted."
        end
    end
end
