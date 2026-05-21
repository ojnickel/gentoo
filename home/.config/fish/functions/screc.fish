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
    set end_time_normalized ""
    if test -n "$_flag_end"
        set colon_count (string match -a ':' $_flag_end | count)
        if test $colon_count -eq 1
            set end_time_normalized "00:$_flag_end"
        else
            set end_time_normalized "$_flag_end"
        end
        set end_arg "-t $end_time_normalized"
    end

    # --- region selection ---
    # builds the ffmpeg -video_size / -i arguments for x11grab
    set region_arg ""
    if set -q _flag_pick
        # step 1: go to ws3, notify, come back, press Enter, go back to capture
        xdotool key super+$workspace
        sleep 0.3
        notify-send "screc" "Move mouse to top-left, then come back and press Enter" -t 20000
        xdotool key super+1
        sleep 0.3
        read -n1 --silent
        xdotool key super+$workspace
        sleep 0.2
        set tl (xdotool getmouselocation)
        set x1 (string replace -r '.*x:(\d+).*' '$1' $tl)
        set y1 (string replace -r '.*y:(\d+).*' '$1' $tl)

        # step 2: stay on ws3, notify, user switches back to ws1 and presses Enter
        notify-send "screc" "Move mouse to bottom-right, switch to ws1, press Enter" -t 20000
        read -n1 --silent
        xdotool key super+$workspace
        sleep 0.2
        set br (xdotool getmouselocation)
        set x2 (string replace -r '.*x:(\d+).*' '$1' $br)
        set y2 (string replace -r '.*y:(\d+).*' '$1' $br)

        set w (math $x2 - $x1)
        set h (math $y2 - $y1)

        # step 3: back to ws1 for confirmation
        xdotool key super+1
        sleep 0.3

        echo "$x1,$y1 -> $x2,$y2  ($w x $h)"
        read -l -P "Confirm? [Y/n] " confirm
        if test "$confirm" = n -o "$confirm" = N
            return 0
        end

        # build and print equivalent screc command with -p instead of -x
        set pick_cmd "screc -w $workspace -p $x1,$y1,$x2,$y2"
        if test -n "$_flag_sleep"; set pick_cmd "$pick_cmd -s $_flag_sleep"; end
        if test -n "$_flag_end";   set pick_cmd "$pick_cmd -e $_flag_end";   end
        if test -n "$_flag_name";  set pick_cmd "$pick_cmd -n $_flag_name";  end
        if test -n "$_flag_dir";   set pick_cmd "$pick_cmd -d $_flag_dir";   end
        if test -n "$_flag_audio"; set pick_cmd "$pick_cmd -a $_flag_audio"; end
        if test -n "$_flag_region";set pick_cmd "$pick_cmd -r $_flag_region";end
        echo $pick_cmd

        set region_arg "-video_size "$w"x"$h" -i :0.0+$x1,$y1"

        # step 4: go to ws3, notify, come back, press Enter, go back, 3s, record
        xdotool key super+$workspace
        sleep 0.3
        notify-send "screc" "Position ready — come back and press Enter to start" -t 20000
        xdotool key super+1
        sleep 0.3
        read -n1 --silent
        xdotool key super+$workspace
        sleep 0.2
        notify-send "screc" "Recording in 3s..." -t 2800
        sleep 3
    else
        # for all non-interactive modes: switch workspace first, then countdown
        xdotool key super+$workspace
        echo "Starting in $sleep_time seconds..."
        sleep $sleep_time

        if test -n "$_flag_points"
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
    end

    # --- record ---
    echo "Recording to $filename"
    set start_time (date +%s)

    if test -n "$_flag_end"
        # convert end time to total seconds for the progress bar
        set t (string split : $end_time_normalized)
        if test (count $t) -eq 3
            set total_secs (math "$t[1] * 3600 + $t[2] * 60 + $t[3]")
        else
            set total_secs (math "$t[1] * 60 + $t[2]")
        end

        # progress bar as a background bash process writing \r to the terminal
        bash -c "
            while true; do
                elapsed=\$(( \$(date +%s) - $start_time ))
                pct=\$(( elapsed * 100 / $total_secs ))
                [ \$pct -gt 100 ] && pct=100
                filled=\$(( pct / 5 ))
                empty=\$(( 20 - filled ))
                bar=\$(printf '%0.s#' \$(seq 1 \$filled) 2>/dev/null)\$(printf '%0.s-' \$(seq 1 \$empty) 2>/dev/null)
                emins=\$(( elapsed / 60 ))
                esecs=\$(( elapsed % 60 ))
                printf '\r[%-20s] %3d%%  %d:%02d' \"\$bar\" \$pct \$emins \$esecs
                sleep 1
            done
        " &
        set bar_pid $last_pid

        # ffmpeg in foreground — Ctrl+C kills it and execution continues
        eval ffmpeg -thread_queue_size 512 -f x11grab $region_arg -thread_queue_size 512 -f pulse -i $audio -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -movflags +faststart -async 1 $end_arg $filename 2>/dev/null
        set ffmpeg_status $status

        kill $bar_pid 2>/dev/null
        printf "\n"
    else
        # no duration — ffmpeg in foreground, output suppressed
        eval ffmpeg -thread_queue_size 512 -f x11grab $region_arg -thread_queue_size 512 -f pulse -i $audio -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -movflags +faststart -async 1 $filename 2>/dev/null
        set ffmpeg_status $status
    end

    # compute and print total duration
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
