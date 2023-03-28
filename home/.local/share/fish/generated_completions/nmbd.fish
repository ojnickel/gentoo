# nmbd
# Autogenerated from man page /usr/share/man/man8/nmbd.8.bz2
complete -c nmbd -s D -l daemon -d 'If specified, this parameter causes nmbd to operate as a daemon'
complete -c nmbd -s F -l foreground -d 'If specified, this parameter causes the main nmbd process to not daemonize, i'
complete -c nmbd -s i -l interactive -d 'If this parameter is specified it causes the server to run "interactively", n…'
complete -c nmbd -s H -l hosts -d 'NetBIOS lmhosts file'
complete -c nmbd -s p -l port -d 'UDP port number is a positive integer value'
complete -c nmbd -l no-process-group -d 'Do not create a new process group for nmbd'
complete -c nmbd -s d -l debuglevel -l debug-stdout -d 'level is an integer from 0 to 10'
complete -c nmbd -l configfile -d 'The file specified contains the configuration details required by the server'
complete -c nmbd -l option -d 'Set the smb. conf(5) option "<name>" to value "<value>" from the command line'
complete -c nmbd -s l -l log-basename -d 'Base directory name for log/debug files.  The extension "'
complete -c nmbd -l leak-report -d 'Enable talloc leak reporting on exit'
complete -c nmbd -l leak-report-full -d 'Enable full talloc leak reporting on exit'
complete -c nmbd -s V -l version -d 'Prints the program version number'
complete -c nmbd -s '?' -l help -d 'Print a summary of command line options'
complete -c nmbd -l usage -d 'Display brief usage message'
complete -c nmbd -s S -d 'parameter had been given'
