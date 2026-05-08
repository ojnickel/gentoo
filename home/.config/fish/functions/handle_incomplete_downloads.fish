function handle_incomplete_downloads -d "list or remove all *.part files and their counterparts" -a action
    if test (count $argv) -eq 0
        echo "Usage: handle_incomplete_downloads [l|list|d|delete]"
        return 1
    end

    set -l found 0
    for partfile in *.part
        if not test -f "$partfile"
            continue
        end

        set -l originalfile (string replace ".part" "" $partfile)

        if test -e "$originalfile"
            set found 1
            switch $action
                case l list
                    echo "Incomplete download: $partfile"
                    echo "Corresponding file: $originalfile"
                    echo "-------------"

                case d delete
                    echo "Deleting: $partfile and $originalfile"
                    rm -v "$partfile" "$originalfile"

                case '*'
                    echo "Usage: handle_incomplete_downloads [l|list|d|delete]"
                    return 1
            end
        end
    end

    if test $found -eq 0
        echo "No incomplete downloads found"
    end
end
