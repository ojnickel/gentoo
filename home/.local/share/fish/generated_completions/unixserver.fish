# unixserver
# Autogenerated from man page /usr/share/man/man1/unixserver.1.bz2
complete -c unixserver -s q -d 'Quiet.  Do not print any messages'
complete -c unixserver -s Q -d '(default) Print error messages'
complete -c unixserver -s v -d 'Verbose.   Print error and status messages'
complete -c unixserver -s d -d 'Do not delete the socket file on exit'
complete -c unixserver -s D -d '(default) Delete the socket file on exit'
complete -c unixserver -s u -d 'Change user id to UID after creating socket'
complete -c unixserver -s g -d 'Change group id to GID after creating socket'
complete -c unixserver -s U -d 'Same as \'-u $UID -g $GID\''
complete -c unixserver -s o -d 'Make the socket owned by UID'
complete -c unixserver -s r -d 'Make the socket group owned by GID'
complete -c unixserver -s O -d 'Same as \'-o $SOCKET_UID -r $SOCKET_GID\''
complete -c unixserver -s p -d 'Set the permissions on the created socket (in octal)'
complete -c unixserver -s m -d 'Set umask to MASK (in octal) before creating socket'
complete -c unixserver -s c -d 'Do not handle more than N simultaneous connections.  (default 10)'
complete -c unixserver -s b -d 'Allow a backlog of N connections'
complete -c unixserver -s B -d 'Write BANNER to the client immediately after connecting'
