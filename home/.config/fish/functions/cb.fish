function cb -d "put text in clipboard" -a text
    if not command -v xsel &>/dev/null
        echo "Error: xsel not found"
        return 1
    end
    echo "$text" | xsel -ib
end
