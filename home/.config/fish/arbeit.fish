function arbeit
    set -l host
    set -l protocol

    #for optarg in $argv]]0      switch $optarg
    #        case l
    #        	host=$optarg y   
    #        case p
    #        	protocol=$optarg[2]
    #        case h
    #            echo "usage: arbeit -l host -p [ssh/sftp]"
    #        case \*
    #          echo unknown option `$optarg[1]`
    #      end
    
    #    end
    #    if test $argv[1] = "pp"
    #         $argv[2]  p7822590@home29658965.1and1-data.host 
    #    end
    switch "$argv[1]"
        case 1u1
            $argv[2]  p7822590@home29658965.1and1-data.host 
        case bbsb
            $argv[2] wp1065095@wp1065095.server-he.de
        case netcup
            $argv[2] hosting132593@hosting132593.a2e2b.netcup.net
        case bup
            echo "pw?"
            read p
            sshpass -p$p $argv[2] wa6181@ok16.serverdomain.org
        case nwf
            $argv[2] u84885618@home623938150.1and1-data.host
        case pp
            echo "pw?"
            read p
            sshpass -p$p $argv[2] ww4281@pfennigparade.de
        case pgw
            $argv[2] u89936386@home690690802.1and1-data.host 
        case rsk
            $argv[2] p96285@home13369541.1and1-data.host
        case fhhh 
            echo "pw?"
            read p
            sshpass -p$p $argv[2] u63691236-pfennigp@home370711702.1and1-data.host
        case teea
            $argv[2]  teealternative.de@ssh.strato.de
        case -s
            echo "1u1"
            echo "bbsb | he"
            echo "netcup"
            echo "bup"
            echo "nwf | 1&1"
            echo "pp  | 1&1   "
            echo "pgw | 1&1" 
            echo "rsk | 1&1" 
            echo "teea"
        case \*
            echo "usage: arbeit [-s][server][protocol]"
    end

end

function createdb
    mysql -u root -pnhrptk -e "CREATE DATABASE $argv; GRANT ALL PRIVILEGES ON $argv.* TO 'web'@'localhost';"
end
function kickstart #.jpa
    #array for db
    #set dbnew localhost web 1234 "$argv[2]"
    #set dbold "<?php echo $this->db->dbhost ?>" "<?php echo $this->db->dbuser ?>" "<?php echo $this->db->dbpass ?>" "<?php echo $this->db->dbname ?>"

    #echo "Copying Kickstart 7.0.1"
    #echo "======================="
    #cp /var/www/localhost/htdocs/arbeit/kickstart/7.0.1/* . 
    #sleep 1s
    #echo "Extracting $argv"
    #echo "======================="
    #php kickstart.php $argv --silent
    #chmod 777 ./installation/tmp -R
    #echo "Renaming DB"
    #echo "======================="
    #sleep 1s
    #set i 1
    #for i in (seq (count $dbold))
    #    echo "$dbold[$i] -> $dbnew[$i]"
    #    sed -n "s/$dbold[$i]/$dbnew[$i]/g" default.php 

    #    #sed -i "s/$dbold[$i]/$dbnew[$i]/g"installation/angie/views/database/tmpl/default.php
    #end
    #sudo cp default.php installation/angie/views/database/tmpl/ -v
    ##    for f in $dbold
    ##        echo "sudo sed -i 's/$f/$dbnew[$i]/g' installation/angie/views/database/tmpl/default.php"
    ##        #        sudo sed 's/$f/$db[$i]/g' 
    ##                set i (math $i + 1)
    ##    end

    ###sudo mv default.php installation/angie/views/database/tmpl/ -v
    #echo "starting installation in ff"
    #echo "======================="
    #sleep 1s
    #db for backup
    echo "Dbname?"
    read answer
    createdb $answer
    set pwd (echo $PWD | cut -d '/' -f 1,2,3,4,5)
    set k (echo $PWD | string replace $pwd 'http://localhost/')
    firefox $k/kickstart.php
    #firefox $k/installation/index.php
end
function stage_test
    if test "$argv[1]" = "wkm"
        set url "wkm-online.de"
    else
        set url "ww-stage.de"
    end
    set www "http://$argv[2].$url"
    curl -I "$www"
    echo "copy URL? y/n"
    read s
    if test $s = "y"
        echo "$www" | xsel -ib
    else
       echo "bye" 
    end
end
