# aria_pack
# Autogenerated from man page /usr/share/man/man1/aria_pack.1.bz2
complete -c aria_pack -s b -l backup -d 'Make a backup of the table as table_name. OLD'
complete -c aria_pack -l character-sets-dir -d 'Directory where character sets are'
complete -c aria_pack -s '#' -l debug -d 'Output debug log.  Often this is \'d:t:o,filename\''
complete -c aria_pack -s f -l force -d 'Force packing of table even if it gets bigger or if tempfile exists'
complete -c aria_pack -s j -l join -d 'Join all given tables into \'new_table_name\''
complete -c aria_pack -s '?' -l help -d 'Display this help and exit'
complete -c aria_pack -s s -l silent -d 'Be more silent'
complete -c aria_pack -s T -l tmpdir -d 'Use temporary directory to store temporary table'
complete -c aria_pack -s t -l test -d 'Don\'t pack table, only test packing it'
complete -c aria_pack -s v -l verbose -d 'Write info about progress and packing result'
complete -c aria_pack -s V -l version -d 'Output version information and exit'
complete -c aria_pack -s w -l wait -d 'Wait and retry if table is in use'
complete -c aria_pack -l print-defaults -d 'Print the program argument list and exit'
complete -c aria_pack -l no-defaults -d 'Don\'t read default options from any option file'
complete -c aria_pack -l defaults-file -d 'Only read default options from the given file #'
complete -c aria_pack -l defaults-extra-file -d 'Read this file after the global files are read'

