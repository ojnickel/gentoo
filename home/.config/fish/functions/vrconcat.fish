function vrconcat -d "Concatenate PREFIX*.mp4 into OUTPUT.mp4. Use -r to re-encode if needed."
    if test (count $argv) -lt 2
        echo "Usage: vrconcat OUTPUT PREFIX [-r]"
        return 1
    end

    set -l output "$argv[1].mp4"
    set -l prefix $argv[2]
    set -l reencode 0

    if contains -r $argv
        set reencode 1
    end

    set -l files (ls $prefix*.mp4 ^/dev/null)

    if test (count $files) -eq 0
        echo "No files found matching '$prefix*.mp4'"
        return 1
    end

    set -l listfile (mktemp)
    for f in $files
        echo "file '$f'" >> $listfile
    end

    if test $reencode -eq 1
        ffmpeg -hide_banner -loglevel error -f concat -safe 0 -i $listfile \
            -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
            -c:v libx264 -preset veryfast -crf 23 \
            -c:a aac -b:a 192k $output
    else
        ffmpeg -hide_banner -loglevel error -f concat -safe 0 -i $listfile -c copy $output
    end

    rm $listfile
    echo "✅ Created: $output"
end
