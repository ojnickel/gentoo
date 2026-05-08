function jumpla -d "jump to last argument from history"
    set -l last_cmd (history --max=1)
    if test -z "$last_cmd"
        echo "No history available"
        return 1
    end

    set -l args (string split " " $last_cmd)
    set -l last_arg $args[-1]

    if test -d "$last_arg"
        cd "$last_arg"
    else
        echo "Not a directory: $last_arg"
        return 1
    end
end
