#!/bin/env fish
function mkcd -d "mkdir and cd"
    mkdir $argv
    cd $argv
end



function rma -d "rm all"
    #f_count .* to see if there is not such files
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
set -gx EDITOR vim

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
            rm -r rar
        end
    end
end

function pmp4 -d "play all mp4 accordig to size"
    for f in (eza -L1 -ssize -r *.mp4)
        mpv $f
    end
end

function dof -d "delete or list double files" -a action

    argparse -N 1 'l/list' 'd/delete' -- action
    for f in *
        for d in *
            set double_f (path change-extension '' $d)
            #if string match -q "$double_f(*)*" $f
            if string match  "$double_f(*)*" $f
                #if test $action[1] = "-l"
                switch $action[1] 
                    case -l --list
                        echo -e "+-> $d \n-------------\n"
                    case -d
                        echo "deleting $f"
                        rm $d -v
                    case \*
                        echo "Nothing to do"
                end
            end
        end
    end
end


function rm_part -d "search and del all wrong dls" -a optional
    set -l f_count 0 #found files
    #set -l  m_part
    for f in *
        if string match -q  "*.part" $f
        #if string match   "*.part" $f
            set m_part $m_part $f
            set d (path change-extension '' "$f")
            set f_match $f_match $d                   
            set f_count (math $f_count + 1)  #####autoincrement
        end
    end
    #function print_lists -d "print the given in a while Loop" -V m_part -V f_match --no-scope-shadowing
        #-V or --inherit-variable NAME snapshots the value of the variable NAME and defines a local variable with that same name and value when the function is executed.").
        #--no-scope-shadowing". This will hand the function all variables, even the
        #local ones, and will let you modify them at will (which includes erasing
        #them). However any variable declared locally inside the function still
        #won't be visible to the outside (which means if you need a variable inside
        #the function to do some work you won't be able to work with a variable of
        #that name from outside  
    #function print_lists -d "print the given in a while Loop" 
        #set -l n 1 
        ##while test $n -le $f_count;
        #while test (count $f_match) -gt 0
        ##for n in (seq $f_count)
           #echo -e "$n. $m_part[$n] \n+--> $f_match[$n]\n-------------\n"
           #set -e f_match[(count $f_match)] # erase last element
           #set n  (math $n + 1) # autoincrement
        #end
    #end
    switch $optional
        case l
            #print_lists
            set n 1 
            while test $n -le (count $m_part)
                echo -e "$n. $m_part[$n] \n+--> $f_match[$n]\n-------------\n"
                set n  (math $n + 1)
            end
        case d
            echo -e "$f_count files will be deleted \n-------------\ndelete them? (y/n)"
            read -f a
            if test $a = "y"
                #while test (count $m_part) -ge 1
                for i in (seq $f_count)
                    rm $m_part[$i] $f_match[$i] 
                    echo -e " $m_part[$i] \n $f_match[$i]\n deleted\n-------------\n"
                end
                #rm "$f" "$d"
            else
                echo -e "not deleting\n-------------\n"
            end
        case x
            for i in (seq $f_count)
                echo -e " $m_part[$i] \n $f_match[$i]\n deleted\n-------------\n"
                rm $m_part[$i] $f_match[$i] -v
            end
    end
end
function p -d "play last 10 mp4s"
    for f in (eza  -smodified -L1 -r *.mp* | head)
        mpv $f
    end
end
function cb -d "put text in clipboard -> clipboard manager" -a text line
    sed -n '$line'p  "$text" | xsel -ib
end
