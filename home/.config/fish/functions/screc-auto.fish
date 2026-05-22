function screc-auto
    argparse 'h/help' 'e/end=' 'd/dir=' 's/sleep=' 'p/points=' 'x/pick' 'w/workspace=' 'n/name=' -- $argv
    or return 1

    if set -q _flag_help
        echo "Usage: screc-auto [OPTIONS]"
        echo "Waits for browser audio, then records the target workspace."
        echo ""
        echo "Options:"
        echo "  -w, --workspace N   Workspace to switch to (default: 3)"
        echo "  -e, --end TIME      Stop after TIME, e.g. 28:04 or 01:30:00"
        echo "  -d, --dir DIR       Output directory (default: current dir)"
        echo "  -s, --sleep SEC     Delay before recording starts (default: 0)"
        echo "  -p, --points C      Region as X1,Y1,X2,Y2"
        echo "  -x, --pick          Pick region interactively with mouse"
        echo "  -n, --name NAME     Base filename (default: MM.DD.YY, .mp4 added)"
        echo "  -h, --help          Show this help"
        return 0
    end

    set ws (test -n "$_flag_workspace"; and echo $_flag_workspace; or echo 3)
    set dir (test -n "$_flag_dir"; and echo $_flag_dir; or echo $PWD)
    set sleep_time (test -n "$_flag_sleep"; and echo $_flag_sleep; or echo 0)
    set audio alsa_output.pci-0000_00_1f.3.hdmi-stereo.monitor
    set rec_name (test -n "$_flag_name"; and echo $_flag_name; or echo (basename $PWD)-(date +%d.%m.%y))

    # --- interactive pick ---
    if set -q _flag_pick
        xdotool key super+$ws
        notify-send "screc-auto" "Move mouse to top-left, switch to ws1, press Enter" -t 30000
        read -n1 --silent
        xdotool key super+$ws
        sleep 0.3
        set tl (xdotool getmouselocation)
        set x1 (string replace -r '.*x:(\d+).*' '$1' $tl)
        set y1 (string replace -r '.*y:(\d+).*' '$1' $tl)

        notify-send "screc-auto" "Move mouse to bottom-right, switch to ws1, press Enter" -t 30000
        read -n1 --silent
        xdotool key super+$ws
        sleep 0.3
        set br (xdotool getmouselocation)
        set x2 (string replace -r '.*x:(\d+).*' '$1' $br)
        set y2 (string replace -r '.*y:(\d+).*' '$1' $br)

        xdotool key super+1
        sleep 0.3
        set pw (math $x2 - $x1)
        set ph (math $y2 - $y1)
        echo "$x1,$y1 -> $x2,$y2  ($pw x $ph)"
        read -l -P "Confirm? [Y/n] " confirm
        if test "$confirm" = n -o "$confirm" = N
            return 0
        end
        set _flag_points "$x1,$y1,$x2,$y2"

        # save to history
        set hist_cmd "screc-auto -w $ws -p $x1,$y1,$x2,$y2 -n $rec_name"
        if set -q _flag_dir;   set hist_cmd "$hist_cmd -d $_flag_dir";  end
        if set -q _flag_end;   set hist_cmd "$hist_cmd -e $_flag_end";  end
        builtin history append $hist_cmd
    end

    # --- wait for browser audio ---
    echo "Waiting for Firefox audio..."
    notify-send "screc-auto" "Waiting for Firefox audio..." -t 5000
    while true
        set playing (pactl list sink-inputs 2>/dev/null | awk '
            /firefox/i { found=1 }
            found && /Unterbrochen: nein/ { print "yes"; found=0 }
            /^Ziel-Eingabe/ { found=0 }
        ')
        if test -n "$playing"
            break
        end
        sleep 1
    end

    # --- switch to target workspace ---
    notify-send "screc-auto" "Audio detected — starting recording" -t 3000
    xdotool key super+$ws
    sleep 0.3
    if test $sleep_time -gt 0
        sleep $sleep_time
    end

    # --- resolve filename ---
    if not test -f $dir/$rec_name.mp4
        set filename $dir/$rec_name.mp4
    else
        set i 1
        while test -f $dir/$rec_name-$i.mp4
            set i (math $i + 1)
        end
        set filename $dir/$rec_name-$i.mp4
    end

    # --- region ---
    if test -n "$_flag_points"
        set pts (string split , $_flag_points)
        set rw (math $pts[3] - $pts[1])
        set rh (math $pts[4] - $pts[2])
        set x_off $pts[1]
        set y_off $pts[2]
    end

    # --- end time ---
    set end_arg ""
    if test -n "$_flag_end"
        set colon_count (string match -a ':' $_flag_end | count)
        if test $colon_count -eq 1
            set end_arg "00:$_flag_end"
        else
            set end_arg "$_flag_end"
        end
    end

    # --- build ffmpeg base args ---
    if test -n "$_flag_points"
        set ff_input -f x11grab -video_size "$rw"x"$rh" -i :0.0+$x_off,$y_off
    else
        set ff_input -f x11grab -i :0.0
    end
    set ff_base -thread_queue_size 512 $ff_input -thread_queue_size 512 -f pulse -i $audio -c:v libx264 -async 1

    set start_time (date +%s)

    if test -n "$end_arg"
        ffmpeg $ff_base -t $end_arg $filename 2>/dev/null &
    else
        ffmpeg $ff_base $filename 2>/dev/null &
    end
    set ffmpeg_pid $last_pid
    set -g _sra_pid $ffmpeg_pid
    function _sra_int --on-signal INT
        kill -INT $_sra_pid 2>/dev/null
    end

    while kill -0 $ffmpeg_pid 2>/dev/null
        set elapsed (math (date +%s) - $start_time)
        set mins (math -s0 $elapsed / 60)
        set secs (math $elapsed % 60)
        printf "\rRecording: $filename  %d:%02d" $mins $secs
        sleep 2
        if not set -q _flag_end
            if not pactl list sink-inputs 2>/dev/null | grep -qi firefox
                kill -INT $ffmpeg_pid 2>/dev/null
                break
            end
        end
    end
    functions -e _sra_int
    set -e _sra_pid
    wait $ffmpeg_pid 2>/dev/null
    set elapsed (math (date +%s) - $start_time)
    set mins (math -s0 $elapsed / 60)
    set secs (math $elapsed % 60)
    printf "\nSaved: $filename ($mins:"(printf '%02d' $secs)")\n"
    read -l -P "Keep? [Y/n] " keep
    if test "$keep" = n -o "$keep" = N
        rm $filename
        echo "Deleted."
    else
        notify-send "screc-auto" "Saved: "(basename $filename) -t 5000
        xdotool key super+1
    end
end
