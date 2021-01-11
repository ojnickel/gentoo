#mkdir and cd into it
function mkcd
    mkdir -p $argv
    cd $argv
end

function arbeit-wp-gitclone
    echo "deleting wp-content"
    sleep 1
    sudo rm -fr wp-content
    git clone $argv wp-content
end

# rme -> remove al except some files
function rme
    for f in $argv
        mv $f ..
    end
    sudo rm * -rvf
    for f in $argv
        mv ../$f ./ -v
    end
end

#rm all and dot files
function rma
    set verbose 0
    
    switch "$argv[1]"
        case -v
            set verbose 1
        case \*
            echo "deleting all files"
    end
    echo "Proceed? y/n"
    read answer
    if test "$answer" = "y"
        if test "$verbose" = 1
            sudo rm * -rfv
            sudo rm .* -rfv
        else
            sudo rm * -rf
            sudo rm .* -rf
        end
    end

end

fish_ssh_agent

#set -g theme_nerd_fonts yes
#set -g theme_display_git yes
#set -g theme_display_git_dirty yes
#set -g theme_display_git_untracked yes
#set -g theme_display_git_ahead_verbose yes
#set -g theme_display_git_dirty_verbose yes
#set -g theme_display_git_stashed_verbose yes
set -g theme_display_git_master_branch yes
#set -g theme_git_worktree_support yes
set -g theme_display_date no
#set -g theme_title_display_user yes
#set -g theme_title_use_abbreviated_path no
set -g fish_prompt_pwd_dir_length 3
set -g default_user your_normal_user
set -g theme_newline_cursor yes
set -g theme_newline_prompt '--> '
set -x PATH /usr/local/sbin:/home/ossi/.local/bin /usr/local/bin:/home/ossi/.local/bin /usr/sbin:/home/ossi/.local/bin /usr/bin:/home/ossi/.local/bin /sbin:/home/ossi/.local/bin /bin:/home/ossi/.local/bin /opt/bin:/home/ossi/.local/bin /usr/lib/llvm/9/bin:/home/ossi/.local/bin

bash /home/ossi/.local/wp-completion.bash
