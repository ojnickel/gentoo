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


source ~/.config/fish/abbreviations.fish

function xrar -d "extract all rar and set today date"
    mkdir rar
    for r in *.rar
        if string match "*.part*" $r
            #echo "skipping $r"
            sleep 1
        else 
            echo "+-------------------------+"
            echo "| $r |"
            echo "+-------------------------+"
            #mkcd "r$r"
            cd rar 
            mv ../$r . -v  
            unrar e $r
            find  . -type f \( -iname \*.mp4 -o -iname "*.avi" \) -exec touch -m {} \; -exec mv {} .. \;
            #for f in *.mp4 
                ##if string match '*.mp4'
                    ##touch -m $f 
                #mv $f .. -v 
                ##else if string match '*.avi'
                    ##touch -m $f 
                    ###mv $f ..
                ###else
                    ###rm -vf $f 
                ##end
            #end
            cd -
            #rm -r rar
        end
    end
end
