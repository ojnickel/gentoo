function fish_right_prompt
    set -l branch (fish_git_prompt '%s' 2>/dev/null)
    if test -n "$branch"
        if not command git diff --quiet --ignore-submodules 2>/dev/null; or not command git diff --quiet --cached --ignore-submodules 2>/dev/null
            set_color -o red
        else if test -n "(command git ls-files --others --exclude-standard 2>/dev/null)"
            set_color -o yellow
        else
            set_color -o green
        end
        set -l ahead (command git rev-list --count @{upstream}..HEAD 2>/dev/null)
        if test -n "$ahead" -a "$ahead" -gt 0
            printf ' %s +%s' $branch $ahead
        else
            printf ' %s' $branch
        end
        set_color normal
    end

    if test $CMD_DURATION -gt 1000
        set_color brblack
        printf ' %ss' (math -s1 $CMD_DURATION / 1000)
        set_color normal
    end
end
