#!/bin/env fish 
function arbeit -d "ssh/sftp quickly in known servers"
    switch $argv[1]
        case 'mkq'
            $argv[2] munichkievqueer.org@ssh.strato.de
        case 'sbs'
            $argv[2] www.sbsfahrdienst.de@ssh.strato.de
        case 'cab'
            $argv[2] u94161847@home745191370.1and1-data.host
        case 'nwfr'
            $argv[2] u84885618@home623938150.1and1-data.host
        case 'netcup'
            $argv[2]    hosting132593@hosting132593.a2e2b.netcup.net  
        case '1u1'
            $argv[2]  p7822590@home29658965.1and1-data.host     
        case 'vfsw'
            set pw 'WOWlOfA=Vw$B%$J$!pV1581qgoP'
            if  test "$argv[2]" = "ssh"
                /usr/bin/sshpass -p $pw ssh vfsw
            else
                /usr/bin/sshpass -p $pw sftp vfsw-sftp 
            end

        case 'pp'
            set pw "PR%KqSMxTUcwdbL2"
            if  test "$argv[2]" = "ssh"
                /usr/bin/sshpass -p $pw ssh ww4281@pfennigparade.de
            else
                /usr/bin/sshpass -p $pw sftp ww4281@pfennigparade.de
            end
        case 'bup'
            set pw "NFKBHOcw"
            set server "wa6181@ok16.serverdomain.org"
            if test "$argv[2]" = "ssh"
                /usr/bin/sshpass -p $pw ssh $server 
            else
                /usr/bin/sshpass -p $pw sftp $server 
            end
        case 'pgw'
            set pw "W+XDk^E?a5`rFa`1q#7/"
            if test "$argv[2]" = "ssh"
                /usr/bin/sshpass -p $pw ssh u89936386@home690690802.1and1-data.host
            else
                /usr/bin/sshpass -p $pw sftp u89936386@home690690802.1and1-data.host
            end
        case 'ssnh'
            $argv[2]   seniorenstiftneuhausen.de@ssh.strato.de
        case 'rwl'
            $argv[2] info@rollwagerl.homepage.t-online.de@hosting.telekom.de 
        case 'sbz'
            set pw "vVm8OTxDmC)"
            /usr/bin/sshpass -p $pw  sftp seh_0@sbz.de    
        case  'bbsb'
            set pw "dm0|7&YZ3#^qEsuY"
                /usr/bin/sshpass -p $pw $argv[2] wp1065095@wp1065095.server-he.de
        case 'rsk'
            $argv[2] p96285@home13369541.1and1-data.host
        case 'talt'
            $argv[2] teealternative.de@ssh.strato.de
        case '-s'
            echo -e "mkq\nvfsw\nsbs\ncab\nnwfr\ntalt\nrsk\nbbsb\n1u1\npp\npgw\nnetcup\nssnh\nrwl\nsbz\t(sftp only)\nbup"
            return
        case ''
            echo "Usage: arbeit SERVER PROTOCOL"
            return
    end
end
function wplistpl -d "list plugins and copy selection"
    set plugins (wp plugin list --field=name)
    set i 1
    for p in $plugins
        echo "$i. $p"
        set i (math $i + 1)
    end
    echo "Select"
    read i
    echo "$plugins[$i]" | xsel -ib
    echo "$plugins[$i] copied"
end

function grbl -d "fetch and checkout a remote branch to local"
    set remote $argv[1]
    set local $argv[1]
    git fetch origin $remote:$local
    git checkout $local
    # or simplier
    # git switch $remote
    # or
    # git checkout --track origin/$remote
end

function switch_php
    set input_file ~/git/devilbox/.env
    if grep 'PHP_SERVER='$argv $input_file
        sed -i 's/^PHP_SERVER/#PHP_SERVER/' $input_file
        sed -i 's/^#PHP_SERVER='$argv'/PHP_SERVER='$argv'/' $input_file
        grep '^PHP_SERVER*' $input_file
    else
        echo "There is no container for PHP " $argv
    end
end
