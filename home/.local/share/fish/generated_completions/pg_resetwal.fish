# pg_resetwal
# Autogenerated from man page /usr/share/man/man1/pg_resetwal.1.bz2
complete -c pg_resetwal -o 'f
.br
--force' -d 'Force pg_resetwal to proceed even if it cannot determine valid data for pg_co…'
complete -c pg_resetwal -o 'n
.br
--dry-run' -d 'The -n/--dry-run option instructs pg_resetwal to print the values reconstruct…'
complete -c pg_resetwal -o 'V
.br
--version' -d 'Display version information, then exit'
complete -c pg_resetwal -o '?
.br
--help' -d 'Show help, then exit'
complete -c pg_resetwal -s c -d 'Manually set the oldest and newest transaction IDs for which the commit time …'
complete -c pg_resetwal -s e -d 'Manually set the next transaction ID\\*(Aqs epoch'
complete -c pg_resetwal -s l -d 'Manually set the WAL starting location by specifying the name of the next WAL…'
complete -c pg_resetwal -s m -d 'Manually set the next and oldest multitransaction ID'
complete -c pg_resetwal -s o -d 'Manually set the next OID'
complete -c pg_resetwal -s O -d 'Manually set the next multitransaction offset'
complete -c pg_resetwal -l wal-segsize -d 'Set the new WAL segment size, in megabytes'
complete -c pg_resetwal -s u -d 'Manually set the oldest unfrozen transaction ID'
complete -c pg_resetwal -s x -d 'Manually set the next transaction ID'
complete -c pg_resetwal -s f -d '(force) option'
complete -c pg_resetwal -l force
complete -c pg_resetwal -s n
complete -c pg_resetwal -l dry-run
complete -c pg_resetwal -o n/--dry-run -d 'option instructs pg_resetwal to print the values reconstructed from pg_contro…'
complete -c pg_resetwal -s V
complete -c pg_resetwal -l version
complete -c pg_resetwal -s '?'
complete -c pg_resetwal -l help
complete -c pg_resetwal -l commit-timestamp-ids
complete -c pg_resetwal -l epoch
complete -c pg_resetwal -l next-wal-file
complete -c pg_resetwal -l multixact-ids
complete -c pg_resetwal -l next-oid
complete -c pg_resetwal -l multixact-offset
complete -c pg_resetwal -l oldest-transaction-id
complete -c pg_resetwal -l next-transaction-id

