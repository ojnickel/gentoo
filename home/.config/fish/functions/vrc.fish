#!/usr/bin/env fish

# Fish shell function to concatenate multiple MP4 videos into one using FFmpeg
function vrc -d "Concatenate multiple MP4 videos into one using FFmpeg"
    set -l output $argv[1]
    set -l input_pattern $argv[2]
    set -l reencode 0

    # Check for re-encode flag
    if contains -- "-r" $argv
        set reencode 1
    end

    # Ensure output has .mp4 extension
    if not string match -q "*.mp4" $output
        set output "$output.mp4"
    end

    # Find all input files matching the pattern
    set input_files (ls $input_pattern*.mp4 2>/dev/null)
    if test (count $input_files) -eq 0
        echo "Error: No input files found matching '$input_pattern*.mp4' in current directory"
        return 1
    end

    # Create temporary file list for FFmpeg
    set temp_file (mktemp)
    for file in $input_files
        # Convert to absolute path
        set abs_path (realpath $file 2>/dev/null)
        if test $status -ne 0
            echo "Error: Cannot resolve path for '$file'"
            rm $temp_file
            return 1
        end
        echo "file '$abs_path'" >> $temp_file
    end

    # Verify temporary file exists and is not empty
    if not test -s $temp_file
        echo "Error: Failed to create valid file list for FFmpeg"
        rm $temp_file
        return 1
    end

    # Run FFmpeg based on re-encode option
    if test $reencode -eq 1
        # Re-encode to ensure compatibility
        ffmpeg -f concat -safe 0 -i $temp_file -c:v libx264 -c:a aac -y $output
    else
        # Attempt to concatenate without re-encoding
        ffmpeg -f concat -safe 0 -i $temp_file -c copy -y $output
    end

    set ffmpeg_status $status

    # Clean up temporary file
    rm $temp_file

    if test $ffmpeg_status -eq 0
        echo "Successfully created $output"
    else
        echo "Error: Failed to concatenate videos"
        return 1
    end
end
