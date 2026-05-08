function fdmv -d "Search for files in current directory and move them to a given directory" -a pattern dest
    if test -z "$pattern" -o -z "$dest"
        echo "Usage: fdmv <pattern> <destination_dir>"
        return 1
    end

    # Find files in current dir (depth=1)
    set files (fd -d 1 -i "$pattern")

    if test (count $files) -eq 0
        echo "No files found for pattern: $pattern"
        return 1
    end

    echo "Found files:"
    for f in $files
        echo "  $f"
    end

    if not test -d "$dest"
        read -P "Directory '$dest' does not exist. Create it? [y/N] " answer
        if test "$answer" = "y" -o "$answer" = "Y"
            mkdir -p "$dest"
            echo "Created: $dest"
        else
            echo "Aborted."
            return 1
        end
    end

    echo "Moving to $dest/..."
    mv $files $dest/
    echo "Done. Moved "(count $files)" file(s)."
end
