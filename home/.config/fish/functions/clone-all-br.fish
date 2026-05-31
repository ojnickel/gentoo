function clone-all-br
    git fetch --all
    for remote_branch in (git branch -r | grep -v '\->' | string trim)
        set local_branch (string replace -r '^[^/]+/' '' $remote_branch)
        if not git show-ref --verify --quiet refs/heads/$local_branch
            git branch --track $local_branch $remote_branch
            echo "Created: $local_branch -> $remote_branch"
        else
            echo "Skipped (exists): $local_branch"
        end
    end
end
