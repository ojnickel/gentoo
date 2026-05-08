function rme -d "remove all except specified files"
    if test (count $argv) -eq 0
        echo "Usage: rme file1 file2 ..."
        return 1
    end

    for f in $argv
        mv "$f" ..
    end
    rm * -rvf
    for f in $argv
        mv ../"$f" ./ -v
    end
end
