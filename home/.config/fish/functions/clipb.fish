function clipb
    argparse 'h/help' 'w/workspace=' 'x/pick' 'p/points=' 's/save' 'n/name=' 'd/dir=' -- $argv
    or return 1

    if set -q _flag_help
        echo "Usage: clipb [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  -w, --workspace N  Switch to workspace N before screenshotting"
        echo "  -x, --pick         Interactively pick region with mouse"
        echo "  -p, --points C     Top-left and bottom-right: X1,Y1,X2,Y2"
        echo "  -s, --save         Save as PNG (default name: datetime, or use -n)"
        echo "  -n, --name NAME    Filename for -s (without .png)"
        echo "  -d, --dir DIR      Output directory for -s (default: ~/Images/screenshots)"
        echo "  -h, --help         Show this help"
        return 0
    end

    set dir (test -n "$_flag_dir"; and echo $_flag_dir; or echo ~/Images/screenshots)
    set tmp (mktemp /tmp/clipb-XXXXXX.png)

    # --- workspace switch ---
    set orig_desktop (xdotool get_desktop)
    if set -q _flag_workspace
        xdotool set_desktop (math $_flag_workspace - 1)
        sleep 0.3
    end

    # --- capture full screen to tmp ---
    DISPLAY=:0 import -window root -screen $tmp

    # --- crop if region specified ---
    if set -q _flag_pick
        echo "Move mouse to top-left corner, then press any key..."
        read -n1 --silent
        set tl (xdotool getmouselocation)
        set x1 (string replace -r '.*x:(\d+).*' '$1' $tl)
        set y1 (string replace -r '.*y:(\d+).*' '$1' $tl)
        echo "Move mouse to bottom-right corner, then press any key..."
        read -n1 --silent
        set br (xdotool getmouselocation)
        set x2 (string replace -r '.*x:(\d+).*' '$1' $br)
        set y2 (string replace -r '.*y:(\d+).*' '$1' $br)
        set w (math $x2 - $x1)
        set h (math $y2 - $y1)
        convert $tmp -crop "$w"x"$h"+$x1+$y1 +repage $tmp
    else if set -q _flag_points
        set pts (string split , $_flag_points)
        set x1 $pts[1]; set y1 $pts[2]; set x2 $pts[3]; set y2 $pts[4]
        set w (math $x2 - $x1)
        set h (math $y2 - $y1)
        convert $tmp -crop "$w"x"$h"+$x1+$y1 +repage $tmp
    end

    # --- to clipboard ---
    xclip -selection clipboard -t image/png < $tmp

    # --- optionally save ---
    if set -q _flag_save
        mkdir -p $dir
        if test -n "$_flag_name"
            set base $_flag_name
        else
            set base (date +%Y-%m-%d_%H-%M-%S)
        end
        set filepath $dir/$base.png
        cp $tmp $filepath
        echo "Saved: $filepath"
    end

    rm -f $tmp

    # --- switch back ---
    if set -q _flag_workspace
        xdotool set_desktop $orig_desktop
    end

    if set -q _flag_save
        echo "Copied to clipboard + saved: $filepath"
        notify-send "clipb" "Screenshot saved: $filepath"
    else
        echo "Copied to clipboard"
        notify-send "clipb" "Screenshot copied to clipboard"
    end
end
