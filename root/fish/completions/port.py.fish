
# argcomplete for port.py (Fish)
function __fish_port.py_complete
    set -lx _ARGCOMPLETE 1
    set -lx _ARGCOMPLETE_IFS 

    set -lx _ARGCOMPLETE_SUPPRESS_SPACE 1
    set -lx _ARGCOMPLETE_SHELL fish
    '/root/port.py' 8>&1 9>&2
end
complete -c port.py -f -a '(__fish_port.py_complete)'
