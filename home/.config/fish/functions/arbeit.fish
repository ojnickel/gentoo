#!/bin/env fish 
function arbeit -d "ssh/sftp quickly in known servers"
    switch $argv[1]
        case 'netcup'
            $argv[2]  -i ~/.ssh/arbeit  hosting132593@hosting132593.a2e2b.netcup.net  
        case '1u1'
            $argv[2] -i ~/.ssh/arbeit p7822590@home29658965.1and1-data.host     
        case 'pp'
            /usr/bin/sshpass -p 7fwg78wC $argv[2] ww4281@pfennigparade.de
        case 'pgw'
            sshpass -p K-H6clmaAK $argv[2] u89936386@home690690802.1and1-data.host
        case 'ssnh'
            $argv[2]  -i ~/.ssh/arbeit seniorenstiftneuhausen.de@ssh.strato.de
        case 'rwl'
            $argv[2] info@rollwagerl.homepage.t-online.de@hosting.telekom.de -i .ssh/arbeit            
        case 'sbz'
            set pw "vVm8OTxDmC)"
            sshpass -p $pw  $argv[2] seh_0@sbz.de    
        case '-s'
            echo -e "1u1\npp\npgw\nnetcup\nssnh\nrwl\nsbz\t(sftp only)"
            return
        case ''
            echo "Usage: arbeit SERVER PROTOCOL"
            return
    end
end
