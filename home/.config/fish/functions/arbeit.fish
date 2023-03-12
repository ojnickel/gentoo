#!/bin/env fish 
function arbeit -d "ssh/sftp quickly in known servers"
    switch $argv[1]
        case 'netcup'
            $argv[2]  -i ~/.ssh/arbeit  hosting132593@hosting132593.a2e2b.netcup.net  
        case '1u1'
            $argv[2] -i ~/.ssh/arbeit p7822590@home29658965.1and1-data.host     
        case 'pp'
            /usr/bin/sshpass -p $argv[2] ww4281@pfennigparade.de
        case 'pgw'
            sshpass -p  $argv[2] u89936386@home690690802.1and1-data.host
        case 'ssnh'
            $argv[2]  -i ~/.ssh/arbeit seniorenstiftneuhausen.de@ssh.strato.de
        case 'rwl'
            $argv[2] info@rollwagerl.homepage.t-online.de@hosting.telekom.de -i .ssh/arbeit            
        case 'sbz'
            set pw 
            sshpass -p $pw  $argv[2] seh_0@sbz.de    
        case  'bbsb'
            sshpass -p  $argv[2] wp1065095@wp1065095.server-he.de
        case 'talt'
            $argv[2] teealternative.de@ssh.strato.de
        case '-s'
            echo -e "bbsb\n1u1\npp\npgw\nnetcup\nssnh\nrwl\nsbz\t(sftp only)"
            return
        case ''
            echo "Usage: arbeit SERVER PROTOCOL"
            return
    end
end
function wplistpl -d "list plugins and copy selection"
    set plugins (wp plugin list --update=available --field=name)
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
