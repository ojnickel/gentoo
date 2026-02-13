function fish_prompt
    set -l last_status $status

    set -l gentoo_icon \uf30d

    if test $last_status -ne 0
        set -l prompt_color (set_color -o red)
    else
        set -l prompt_color (set_color -o white)
    end

    printf '%s%s %s%s@%s %s%s%s\n' \
        (set_color -o magenta) $gentoo_icon \
        (set_color -o red) $USER (prompt_hostname) \
        (set_color -o blue) (prompt_pwd) \
        (set_color normal)

    printf '%s#%s ' \
        (if test $last_status -ne 0; set_color -o red; else; set_color -o white; end) \
        (set_color normal)
end
