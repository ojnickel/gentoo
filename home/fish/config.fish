#!/bin/env fish
function mkcd -d "mkdir and cd"
    mkdir $argv
    cd $argv
end



function rma -d "rm all"
    #count .* to see if there is not such files
    set -l dot_f .*
    # same for files
    set -l files *
    # answer for del -> false 
    set a "no"

    if test $argv[1] = "-y"
        set a "yes"
    else
        set dir (echo $PWD)
        echo "rm in $dir? [yes]"
        read a
    end

    if test $a = "yes"
        if test (count $dot_f) -gt 0
            echo "deleting .*"
            rm .* -vf
        end
        if test (count $files) -gt 0
            echo "deleting *"
            rm * -rvf
        end
    end
end

#ssh-agent for fish
#use starship theme
starship init fish | source


