function new_git_branch --description "Create a new git branch locally and push it to remote"
    if test (count $argv) -ne 1
        echo "Usage: new_git_branch <branch-name>"
        return 1
    end

    set -l branch $argv[1]

    git switch -c $branch; and git push -u origin $branch
end
