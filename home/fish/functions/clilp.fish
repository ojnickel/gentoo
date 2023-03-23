function clilpass
    set i 0
    set listLog 
    for li in (lpass ls | grep -i $argv[1] | cut -d " " -f 1)
        # i++
        set i (math $i +1)
        echo  " $i $li"
        # append to array
        set listLog $listLog $li
    end
    set a 0
    set b ""
    # check if anything is there
    if test -z "$listLog"
        echo "Nothing found"
        return
    end
    echo "Select login:"
    read a
    echo "Use Category? [y/n]"
    read b
    if test $b = "n"
        #without category name. Couldn']t fig ure out, how to escape ()
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
                echo "copied password of $listLog[$a]"
            case "u"
                lpass show $listLog[$a] --username -c
                echo "copied username of $listLog[$a]"
            case "w"
                lpass show $listLog[$a] --url -c
                echo "copied url of $listLog[$a] "
            case "x"
                set loop 0
        end
    end
    
#    echo "Type []p/u?"
#    read  b
#    lpass show  $argv[$a]
end

