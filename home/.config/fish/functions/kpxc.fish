function kpxc -d "KeePassXC CLI fuzzy search interface"
    set -l db ~/pp-on.kdbx
    set -l key ~/pp-on.keyx

    if not command -v keepassxc-cli &>/dev/null
        echo "Error: keepassxc-cli not found"
        return 1
    end

    if not command -v fzf &>/dev/null
        echo "Error: fzf not found"
        return 1
    end

    if not test -f $db
        echo "Error: Database not found: $db"
        return 1
    end

    if not test -f $key
        echo "Error: Key file not found: $key"
        return 1
    end

    set -l list (keepassxc-cli ls -R $db 2>/dev/null | sed '1d')
    if test $status -ne 0
        echo "Error: Failed to read database"
        return 1
    end

    set -l query (string join ' ' $argv)

    set -l entry (printf '%s\n' $list \
        | fzf --height=50% --border --ansi \
              --query="$query" \
              --prompt="🔍 Search: ")

    if test -n "$entry"
        keepassxc-cli show -s -k $key $db "$entry"
    end
end
