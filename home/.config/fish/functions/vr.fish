function vr
    set -l use_vaapi 1

    # Check for --no-vaapi
    if contains -- --no-vaapi $argv
        set use_vaapi 0
        set argv (string match -v -- "--no-vaapi" $argv)
    end

    if test (count $argv) -lt 2
        echo "Usage: vr <sleep_seconds> <output_name> [--no-vaapi]"
        return 1
    end

    set -l sleep_seconds $argv[1]
    set -l output_name $argv[2].mp4

    # Sleep first
    echo "Sleeping $sleep_seconds seconds..."
    sleep $sleep_seconds

    # Get resolution from xrandr
    set -l resolution (xrandr | grep '*' | awk '{print $1}' | head -n 1)

    # HDMI audio device name (adjust if needed)
    set -l audio_source alsa_output.pci-0000_00_1f.3.hdmi-stereo.monitor

    # Common ffmpeg input
    set -l input_args "-f x11grab -video_size $resolution -i $DISPLAY -f pulse -i $audio_source -t 30"

    # VAAPI encoder
    if test $use_vaapi -eq 1
        echo "Recording with VAAPI hardware acceleration..."
        ffmpeg \
            -vaapi_device /dev/dri/renderD128 \
            -f x11grab -video_size $resolution -i $DISPLAY \
            -f pulse -i $audio_source \
            -vf 'format=nv12,hwupload' \
            -c:v h264_vaapi -b:v 5M \
            -c:a aac \
            -y $output_name
    else
        echo "Recording without VAAPI (CPU encoding)..."
        ffmpeg \
            -f x11grab -video_size $resolution -i $DISPLAY \
            -f pulse -i $audio_source \
            -c:v libx264 -preset veryfast -crf 23 \
            -c:a aac \
            -y $output_name
    end
end
