# chcon
# Autogenerated from man page /usr/share/man/man1/chcon.1.bz2
complete -c chcon -l dereference -d 'affect the referent of each symbolic link (this is the default), rather than …'
complete -c chcon -s h -l no-dereference -d 'affect symbolic links instead of any referenced file'
complete -c chcon -s u -l user -d 'set user USER in the target security context'
complete -c chcon -s r -l role -d 'set role ROLE in the target security context'
complete -c chcon -s t -l type -d 'set type TYPE in the target security context'
complete -c chcon -s l -l range -d 'set range RANGE in the target security context'
complete -c chcon -l no-preserve-root -d 'do not treat \'/\' specially (the default)'
complete -c chcon -l preserve-root -d 'fail to operate recursively on \'/\''
complete -c chcon -l reference -d 'use RFILE\'s security context rather than specifying a CONTEXT value'
complete -c chcon -s R -l recursive -d 'operate on files and directories recursively'
complete -c chcon -s v -l verbose -d 'output a diagnostic for every file processed '
complete -c chcon -s H -d 'if a command line argument is a symbolic link to a directory, traverse it'
complete -c chcon -s L -d 'traverse every symbolic link to a directory encountered'
complete -c chcon -s P -d 'do not traverse any symbolic links (default)'
complete -c chcon -l help -d 'display this help and exit'
complete -c chcon -l version -d 'output version information and exit AUTHOR Written by Russell Coker and Jim M…'

