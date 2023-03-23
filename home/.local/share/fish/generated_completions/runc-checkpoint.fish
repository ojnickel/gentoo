# runc-checkpoint
# Autogenerated from man page /usr/share/man/man8/runc-checkpoint.8.bz2
complete -c runc-checkpoint -l image-path -d 'Set path for saving criu image files.  The default is . /checkpoint'
complete -c runc-checkpoint -l work-path -d 'Set path for saving criu work files and logs'
complete -c runc-checkpoint -l parent-path -d 'Set path for previous criu image files, in pre-dump'
complete -c runc-checkpoint -l leave-running -d 'Leave the process running after checkpointing'
complete -c runc-checkpoint -l tcp-established -d 'Allow checkpoint/restore of established TCP connections'
complete -c runc-checkpoint -l ext-unix-sk -d 'Allow checkpoint/restore of external unix sockets'
complete -c runc-checkpoint -l shell-job -d 'Allow checkpoint/restore of shell jobs'
complete -c runc-checkpoint -l lazy-pages -d 'Use lazy migration mechanism.  See criu --lazy-pages option \\[la]https://criu'
complete -c runc-checkpoint -l status-fd -d 'Pass a file descriptor fd to criu'
complete -c runc-checkpoint -l page-server -d 'Start a page server at the specified IP-address and port'
complete -c runc-checkpoint -l file-locks -d 'Allow checkpoint/restore of file locks'
complete -c runc-checkpoint -l pre-dump -d 'Do a pre-dump, i. e'
complete -c runc-checkpoint -l manage-cgroups-mode -d 'Cgroups mode.  Default is soft'
complete -c runc-checkpoint -l empty-ns -d 'Checkpoint a namespace, but don\'t save its properties'
complete -c runc-checkpoint -l auto-dedup -d 'Enable auto deduplication of memory images'

