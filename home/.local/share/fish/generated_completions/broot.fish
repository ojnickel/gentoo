# broot
# Autogenerated from man page /usr/share/man/man1/broot.1.bz2
complete -c broot -s d -l dates -d 'Show the last modified date of files and directories'
complete -c broot -s D -l no-dates -d 'Don\'t show the last modified date'
complete -c broot -s f -l only-folders -d 'Only show folders'
complete -c broot -s F -l no-only-folders -d 'Show folders and files alike'
complete -c broot -s g -l show-git-info -d 'Show git statuses on files and stats of repository'
complete -c broot -s G -l no-show-git-info -d 'Don\'t show git statuses on files nor stats'
complete -c broot -s h -l hidden -d 'Show hidden files'
complete -c broot -s H -l no-hidden -d 'Don\'t show hidden files'
complete -c broot -s i -l show-gitignored -d 'Show files which should be ignored according to git'
complete -c broot -s I -l no-show-gitignored -d 'Don\'t show gitignored files'
complete -c broot -s p -l permissions -d 'Show permissions with owner and group'
complete -c broot -s P -l no-permissions -d 'Don\'t show permissions'
complete -c broot -s s -l sizes -d 'Show the sizes of files and directories'
complete -c broot -s S -l no-sizes -d 'Don\'t show sizes'
complete -c broot -s t -l trim-root -d 'Trim the root: remove elements which would exceed the screen size'
complete -c broot -s T -l no-trim-root -d 'Don\'t trim the root (still trim the deeper levels)'
complete -c broot -l install -d 'Install or reinstall the br shell function'
complete -c broot -l color -d 'Controls styling of the output (default: auto)'
complete -c broot -l help -d 'Prints a help page, with more or less the same content as this man page'
complete -c broot -s v -l version -d 'Prints the version of broot PARAMETERS:'
complete -c broot -l outcmd -d 'Where to write a command if broot produces one'
complete -c broot -s c -l cmd -d 'Semicolon separated commands to execute on start of broot'
complete -c broot -l height -d 'Height to use if you don\'t want to fill the screen or for file export (by def…'
complete -c broot -s o -l out -d 'Where to write the produced path, if any'
complete -c broot -l set-install-state -d 'Set the installation state'
complete -c broot -l print-shell-function -d 'Print to stdout the br function for the given shell'

