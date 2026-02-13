function u -d "sync portage / update world / both"
    echo "1) Sync only"
    echo "2) Update world only"
    echo "3) Sync + update world"
    read -n 1 -P "Choose: " choice

    switch $choice
        case 1
            emaint sync -a
        case 2
            emerge -uavDN world
        case 3
            emaint sync -a
            and emerge -uavDN world
        case '*'
            echo "Invalid choice."
            return 1
    end
end
