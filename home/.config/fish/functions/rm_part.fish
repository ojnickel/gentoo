function rm_part -d "search and delete incomplete downloads (.part files)" -a action
    set -l f_count 0
    set -l m_part
    set -l f_match

    for f in *.part
        if test -f "$f"
            set -a m_part $f
            set -l base (path change-extension '' "$f")
            set -a f_match $base
            set f_count (math $f_count + 1)
        end
    end

    if test $f_count -eq 0
        echo "No .part files found"
        return 0
    end

    switch $action
        case l list
            set -l n 1
            while test $n -le (count $m_part)
                echo "$n. $m_part[$n]"
                echo "    -> $f_match[$n]"
                echo "-------------"
                set n (math $n + 1)
            end

        case d delete
            echo "$f_count file pair(s) will be deleted"
            echo "Delete them? (y/n)"
            read -l answer
            if test "$answer" = "y"
                for i in (seq $f_count)
                    echo "Deleting: $m_part[$i]"
                    rm -v "$m_part[$i]"
                    if test -e "$f_match[$i]"
                        rm -v "$f_match[$i]"
                    end
                    echo "-------------------------"
                end
            else
                echo "Aborted"
            end

        case x force
            for i in (seq $f_count)
                echo "Deleting: $m_part[$i] and $f_match[$i]"
                rm -v "$m_part[$i]" "$f_match[$i]" 2>/dev/null
                echo "-------------"
            end

        case '*'
            echo "Usage: rm_part [l|list|d|delete|x|force]"
            return 1
    end
end
