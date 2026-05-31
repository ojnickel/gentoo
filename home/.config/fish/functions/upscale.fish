function upscale
    # usage: upscale <input> [720|1080] [-f] [-e] [-c seconds]
    if test (count $argv) -eq 0; or contains -- -h $argv; or contains -- --help $argv
        echo "usage: upscale <input> [720|1080] [-f|--fast] [-e|--enhance] [-c|--cut seconds]"
        echo ""
        echo "  (default)    AI upscale x4 then resize to target height (slow)"
        echo "  -f/--fast    lanczos resize + sharpen (fast, no AI)"
        echo "  -e/--enhance sharpen + denoise at original resolution (no resize)"
        echo "  -c/--cut N   trim input to first N seconds before processing"
        echo "  720|1080     target height (default: 1080, ignored with -e)"
        return
    end

    set input (realpath $argv[1])
    set target_h 1080
    set fast 0
    set enhance 0
    set cut ""
    set skip_next 0

    for i in (seq 2 (count $argv))
        if test $skip_next -eq 1
            set skip_next 0
            continue
        end
        set arg $argv[$i]
        switch $arg
            case --help -h
                echo "usage: upscale <input> [720|1080] [-f|--fast] [-e|--enhance] [-c|--cut seconds]"
                echo ""
                echo "  (default)    AI upscale x4 then resize to target height (slow)"
                echo "  -f/--fast    lanczos resize + sharpen (fast, no AI)"
                echo "  -e/--enhance sharpen + denoise at original resolution (no resize)"
                echo "  -c/--cut N   trim input to first N seconds before processing"
                echo "  720|1080     target height (default: 1080, ignored with -e)"
                return
            case --fast -f
                set fast 1
            case --enhance -e
                set enhance 1
            case --cut -c
                set next (math $i + 1)
                set cut $argv[$next]
                set skip_next 1
            case '*'
                set target_h $arg
        end
    end

    set base (string replace -r '\.[^.]+$' '' $input)
    set ext (string match -r '[^.]+$' $input)
    set name (basename $base)
    set outdir /mnt/samsung/admin/soft/upscale
    set workdir $outdir/$name
    set audio_tmp $workdir/audio.aac

    mkdir -p $workdir

    # build cut flag for ffmpeg
    set cut_flag ""
    if test -n "$cut"
        set cut_flag "-t $cut"
    end

    # extract audio separately (more reliable than -map 1:a on frame reassembly)
    set has_audio 0
    ffmpeg -i $input $cut_flag -vn -c:a copy $audio_tmp -y 2>/dev/null
    and set has_audio 1

    if test $enhance -eq 1
        set output $outdir/{$name}-enhanced.$ext
        echo "Enhancing (sharpen+denoise, same resolution)..."
        if test $has_audio -eq 1
            ffmpeg -i $input $cut_flag \
                -vf "unsharp=5:5:1.0:3:3:0.5,hqdn3d=1.5:1.5:6:6" \
                -c:v libx264 -crf 28 -c:a copy \
                $output
        else
            ffmpeg -i $input $cut_flag \
                -vf "unsharp=5:5:1.0:3:3:0.5,hqdn3d=1.5:1.5:6:6" \
                -c:v libx264 -crf 28 \
                $output
        end
        echo "Done: $output"
        return
    end

    if test $fast -eq 1
        set output $outdir/{$name}-{$target_h}p-nonai.$ext
        echo "Fast mode (lanczos+sharpen)..."
        set vf "scale=-2:$target_h:flags=lanczos,unsharp=5:5:0.8:3:3:0.4,pad=iw:$target_h:(ow-iw)/2:(oh-ih)/2"
        if test $has_audio -eq 1
            ffmpeg -i $input $cut_flag \
                -vf $vf \
                -c:v libx264 -crf 16 -c:a copy \
                $output
        else
            ffmpeg -i $input $cut_flag \
                -vf $vf \
                -c:v libx264 -crf 16 \
                $output
        end
        echo "Done: $output"
        return
    end

    # AI mode
    set frames $workdir/frames
    set frames_out $workdir/frames_out
    mkdir -p $frames $frames_out

    if test (count $frames/*.png) -eq 0
        echo "Extracting frames..."
        ffmpeg -i $input $cut_flag $frames/frame%08d.png
    else
        echo "Frames already extracted, skipping."
    end

    if test (count $frames_out/*.png) -eq 0
        set total (count $frames/*.png)
        echo "Upscaling $total frames..."
        realesrgan-ncnn-vulkan -i $frames -o $frames_out -s 4 -n realesrgan-x4plus -t 32 2>&1 | \
            python3 -c "
import sys, re
total = int(sys.argv[1])
frame = 0
bar_w = 28
for line in sys.stdin:
    line = line.strip()
    m = re.search(r'(\d+(?:\.\d+)?)%', line)
    if m:
        pct = float(m.group(1))
        if pct >= 100:
            frame += 1
        filled = int(bar_w * pct / 100)
        bar = '#' * filled + '-' * (bar_w - filled)
        overall_pct = frame / total * 100
        sys.stdout.write(f'\r[{bar}] {pct:5.1f}%  |  frame {frame}/{total} ({overall_pct:.1f}%)  ')
        sys.stdout.flush()
sys.stdout.write('\n')
" $total
    else
        echo "Frames already upscaled, skipping."
    end

    set output $outdir/{$name}-{$target_h}p.$ext
    echo "Reassembling video..."
    set fps (ffprobe -v error -select_streams v -of csv=p=0 -show_entries stream=r_frame_rate $input)
    set vf "scale=-2:$target_h:flags=lanczos,pad=iw:$target_h:(ow-iw)/2:(oh-ih)/2"
    if test $has_audio -eq 1
        ffmpeg -framerate $fps -i $frames_out/frame%08d.png \
            -i $audio_tmp \
            -vf $vf \
            -c:v libx264 -crf 18 -c:a aac -b:a 192k \
            -pix_fmt yuv420p -movflags +faststart \
            $output
    else
        ffmpeg -framerate $fps -i $frames_out/frame%08d.png \
            -vf $vf \
            -c:v libx264 -crf 18 \
            -pix_fmt yuv420p -movflags +faststart \
            $output
    end

    echo "Done: $output"
end
