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

            set -l equery_out (equery --nocolor uses "$package" 2>/dev/null)
            if test -z "$equery_out"
                echo "Package not found or no USE flags available"
                return 1
            end

            set -l state_file (mktemp)
            set -l orig_file (mktemp)
            set -l toggle_script (mktemp)
            printf '%s\n' $equery_out > $state_file
            printf '%s\n' $equery_out > $orig_file

            # Write toggle script: flips +flag <-> -flag in state_file
            string join \n -- \
                '#!/bin/bash' \
                'line="$1"' \
                'name="${line:1}"' \
                'state="${line:0:1}"' \
                "if [ \"\$state\" = '+' ]; then" \
                "    sed -i \"s|^+\${name}\$|-\${name}|\" $state_file" \
                'else' \
                "    sed -i \"s|^-\${name}\$|+\${name}|\" $state_file" \
                'fi' > $toggle_script
            chmod +x $toggle_script

            fzf \
                --height=80% --border \
                --prompt="USE flags > " \
                --header="SPACE=toggle +/-  ENTER=confirm  ESC=cancel" \
                --bind "space:execute-silent($toggle_script {})+reload(cat $state_file)" \
                < $state_file
            set -l fzf_status $status

            # Only write flags that changed from original state
            set -l changed
            while read -l line
                if not grep -qxF -- $line $orig_file
                    set name (string sub -s 2 -- $line)
                    set state (string sub -l 1 -- $line)
                    if test $state = -
                        set -a changed "-$name"
                    else
                        set -a changed $name
                    end
                end
            end < $state_file
            rm -f $state_file $orig_file $toggle_script

            if test $fzf_status -ne 0
                echo "Cancelled."
                return 1
            end

            if test -z "$changed"
                echo "No changes made."
                return 0
            end

            set -l flags (string join ' ' -- $changed)

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
