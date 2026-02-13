function portage -d "interactive portage USE flag / keyword configuration"
    set -l package $argv[1]

    if test -z "$package"
        echo "Select a package (start typing to search):"
        set package (find /usr/portage/ -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sed 's|/usr/portage/||' | fzf)

        if test -z "$package"
            echo "No package selected. Exiting."
            return 1
        end
    end

    echo "What do you want to configure for $package?"
    echo "1) USE flags"
    echo "2) Accept keywords"
    read -n 1 choice

    switch $choice
        case 1
            set -l config_file "/etc/portage/package.use/packages"

            echo "Available USE flags for $package:"
            echo "=================================="
            equery uses "$package" 2>/dev/null | grep -E '^\s*[+-]'; or echo "Package not found or no USE flags available"
            echo ""

            set -l available_flags (equery uses "$package" 2>/dev/null | grep -E '^\s*[+-]' | awk '{print $2}')
            set -l flags ""
            if test -n "$available_flags"
                echo "Select USE flags (use TAB for multi-select):"
                set -l selected (printf '%s\n' $available_flags | fzf -m --height=50% --border --prompt="USE flags: ")
                if test -n "$selected"
                    set flags (string join ' ' $selected)
                end
            end

            if test -z "$flags"
                echo "No USE flags selected. Enter manually:"
                read flags
                if test -z "$flags"
                    echo "No flags provided. Exiting."
                    return 1
                end
            end

            echo ""
            echo "Will add to $config_file:"
            echo "  $package $flags"
            echo "Proceed? (y/n)"
            read -n 1 confirm

            if test "$confirm" = y -o "$confirm" = Y
                mkdir -p (dirname "$config_file") 2>/dev/null
                echo "$package $flags" | tee -a "$config_file"
                echo "Successfully added."
            else
                echo "Cancelled."
                return 1
            end

        case 2
            set -l config_file "/etc/portage/package.accept_keywords"

            echo "Available keywords for $package:"
            echo "=================================="
            portageq metadata / ebuild "$package" KEYWORDS 2>/dev/null; or echo "Package not found"
            echo ""
            echo "Current architecture: "(portageq envvar ARCH 2>/dev/null)
            echo ""

            set -l keyword_options "~amd64 - Accept unstable on amd64\n~x86 - Accept unstable on x86\n** - Accept any keyword"
            set -l flags (printf "$keyword_options" | fzf --height=50% --border --prompt="Keyword: " | awk '{print $1}')

            if test -z "$flags"
                echo "No keyword selected. Enter manually:"
                read flags
                if test -z "$flags"
                    echo "No keyword provided. Exiting."
                    return 1
                end
            end

            echo ""
            echo "Will add to $config_file:"
            echo "  $package $flags"
            echo "Proceed? (y/n)"
            read -n 1 confirm

            if test "$confirm" = y -o "$confirm" = Y
                echo "$package $flags" | tee -a "$config_file"
                echo "Successfully added."
            else
                echo "Cancelled."
                return 1
            end

        case '*'
            echo "Invalid choice."
            return 1
    end
end
