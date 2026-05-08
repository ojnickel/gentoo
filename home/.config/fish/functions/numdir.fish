function numdir -d "rename all files of type to numbered sequence" -a file_ext
    if test (count $argv) -eq 0
        echo "Usage: numdir <file_extension>"
        return 1
    end

    set -l files *.$file_ext
    if not test -f $files[1]
        echo "No .$file_ext files found"
        return 0
    end

    set -l i 1
    for f in $files
        set -l target "$i.$file_ext"
        if test -e "$target"; and test "$f" != "$target"
            echo "Error: $target already exists"
            return 1
        end
        mv -v "$f" "$target"
        set i (math $i + 1)
    end
end
