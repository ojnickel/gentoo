#!/bin/env fish
function mkcd -d "mkdir and cd"
    mkdir $argv
    cd $argv
end
function clilpass
    set i 0
    set listLog 
    for li in (lpass ls | grep $argv[1] | cut -d " " -f 1)
        # i++
        set i (math $i +1)
        echo  " $i $li"
        # append to array
        set listLog $listLog $li
    end
    set a 0
    set b ""
    echo "Select login:"
    read a
    echo "Use Category? [y/n]"
    read b
    if test $b = "n"
        #without category name. Couldn't fig ure out, how to escape ()
        set listLog[$a] (echo $listLog[$a] | cut -d "/" -f 2)
    end
    echo $listLog[$a]
    lpass show $listLog[$a]
    
    set loop 1
    while test $loop -eq 1
        echo "Copy [p|u|w|x]"
        read b
        switch $b
            case "p"
                lpass show $listLog[$a] --password -c
            case "u"
                lpass show $listLog[$a] --username -c
            case "w"
                lpass show $listLog[$a] --url -c
            case "x"
                set loop 0
        end
    end
    
#    echo "Type []p/u?"
#    read  b
#    lpass show  $argv[$a]
end


