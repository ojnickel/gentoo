function susp --description "Suspend to RAM after idle timeout (default 3 min)"
    set mins (if set -q argv[1]; echo $argv[1]; else; echo 3; end)
    set timeout_ms (math $mins \* 60000)
    echo "Suspending after $mins min idle..."
    while true
        set idle (xprintidle)
        if test $idle -ge $timeout_ms
            sudo s2ram
            return
        end
        sleep 5
    end
end
