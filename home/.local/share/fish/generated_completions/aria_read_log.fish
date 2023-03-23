# aria_read_log
# Autogenerated from man page /usr/share/man/man1/aria_read_log.1.bz2
complete -c aria_read_log -s a -l apply -d 'Apply log to tables: modifies tables! you should make a backup first!  Displa…'
complete -c aria_read_log -l character-sets-dir -d 'Directory where character sets are'
complete -c aria_read_log -s c -l check -d 'if --display-only, check if record is fully readable (for debugging)'
complete -c aria_read_log -s '#' -l debug -d 'Output debug log.  Often the argument is \'d:t:o,filename\''
complete -c aria_read_log -l force-crash -d 'Force crash after # recovery events'
complete -c aria_read_log -s '?' -l help -d 'Display this help and exit'
complete -c aria_read_log -s d -l display-only -d 'display brief info read from records\' header'
complete -c aria_read_log -s e -l end-lsn -d 'Stop applying at this lsn.  If end-lsn is used, UNDO:s will not be applied'
complete -c aria_read_log -s h -l aria-log-dir-path -d 'Path to the directory where to store transactional log'
complete -c aria_read_log -s P -l page-buffer-size -d 'The size of the buffer used for index blocks for Aria tables'
complete -c aria_read_log -s o -l start-from-lsn -d 'Start reading log from this lsn'
complete -c aria_read_log -s C -l start-from-checkpoint -d 'Start applying from last checkpoint'
complete -c aria_read_log -s s -l silent -d 'Print less information during apply/undo phase'
complete -c aria_read_log -s T -l tables-to-redo -d 'List of tables separated with , that we should apply REDO on'
complete -c aria_read_log -s t -l tmpdir -d 'Path for temporary files'
complete -c aria_read_log -l translog-buffer-size -d 'The size of the buffer used for transaction log for Aria tables'
complete -c aria_read_log -s u -l undo -d 'Apply UNDO records to tables'
complete -c aria_read_log -s v -l verbose -d 'Print more information during apply/undo phase'
complete -c aria_read_log -s V -l version -d 'Print version and exit'
complete -c aria_read_log -l print-defaults -d 'Print the program argument list and exit'
complete -c aria_read_log -l no-defaults -d 'Don\'t read default options from any option file'
complete -c aria_read_log -l defaults-file -d 'Only read default options from the given file #'
complete -c aria_read_log -l disable-undo -d '(Defaults to on; use --skip-undo to disable. )'
complete -c aria_read_log -l defaults-extra-file -d 'Read this file after the global files are read'

