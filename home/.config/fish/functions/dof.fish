function dof -d "delete or list duplicate files with (n) pattern"
    argparse 'l/list' 'd/delete' -- $argv
    or return 1

    if not set -q _flag_list; and not set -q _flag_delete
        echo "Usage: dof [-l|--list] [-d|--delete]"
        return 1
    end

    for f in *
        for d in *
            if test "$f" = "$d"
                continue
            end

            set -l base (path change-extension '' $d)
            if string match -q "$base(*)*" $f
                if set -q _flag_list
                    echo "+-> Original: $d"
                    echo "    Duplicate: $f"
                    echo "-------------"
                else if set -q _flag_delete
                    echo "Deleting duplicate: $d"
                    rm "$d" -v
                end
            end
        end
    end
end
