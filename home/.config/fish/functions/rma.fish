function rma -d "rm all files in current directory with confirmation"
    set -l a "no"

    if test (count $argv) -gt 0; and test "$argv[1]" = "-y"
        set a "yes"
    else
        echo "rm all files in $PWD? [yes/no]"
        read a
    end

    if test "$a" = "yes"
        set -l dot_files (string match -v '.' (string match -v '..' .*))
        set -l regular_files *

        if test (count $dot_files) -gt 0
            echo "Deleting hidden files..."
            rm -vf $dot_files
        end

        if test (count $regular_files) -gt 0
            echo "Deleting regular files..."
            rm -rvf $regular_files
        end
    else
        echo "Aborted"
    end
end
