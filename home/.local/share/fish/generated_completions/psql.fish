# psql
# Autogenerated from man page /usr/share/man/man1/psql.1.bz2
complete -c psql -o 'a
.br
--echo-all' -d 'Print all nonempty input lines to standard output as they are read'
complete -c psql -o 'A
.br
--no-align' -d 'Switches to unaligned output mode.  (The default output mode is aligned'
complete -c psql -o 'b
.br
--echo-errors' -d 'Print failed SQL commands to standard error output'
complete -c psql -s c -d 'Specifies that psql is to execute the given command string, command'
complete -c psql -l csv -d 'Switches to CSV (Comma-Separated Values) output mode'
complete -c psql -s d -d 'Specifies the name of the database to connect to'
complete -c psql -o 'e
.br
--echo-queries' -d 'Copy all SQL commands sent to the server to standard output as well'
complete -c psql -o 'E
.br
--echo-hidden' -d 'Echo the actual queries generated by d and other backslash commands'
complete -c psql -s f -d 'Read commands from the file filename, rather than standard input'
complete -c psql -s F -d 'Use separator as the field separator for unaligned output'
complete -c psql -s h -d 'Specifies the host name of the machine on which the server is running'
complete -c psql -o 'H
.br
--html' -d 'Switches to HTML output mode'
complete -c psql -o 'l
.br
--list' -d 'List all available databases, then exit'
complete -c psql -s L -d 'Write all query output into file filename, in addition to the normal output d…'
complete -c psql -o 'n
.br
--no-readline' -d 'Do not use Readline for line editing and do not use the command history'
complete -c psql -s o -d 'Put all query output into file filename.  This is equivalent to the command o'
complete -c psql -s p -d 'Specifies the TCP port or the local Unix-domain socket file extension on whic…'
complete -c psql -s P -d 'Specifies printing options, in the style of pset'
complete -c psql -o 'q
.br
--quiet' -d 'Specifies that psql should do its work quietly'
complete -c psql -s R -d 'Use separator as the record separator for unaligned output'
complete -c psql -o 's
.br
--single-step' -d 'Run in single-step mode'
complete -c psql -o 'S
.br
--single-line' -d 'Runs in single-line mode where a newline terminates an SQL command, as a semi…'
complete -c psql -o 't
.br
--tuples-only' -d 'Turn off printing of column names and result row count footers, etc'
complete -c psql -s T -d 'Specifies options to be placed within the HTML table tag'
complete -c psql -s U -d 'Connect to the database as the user username instead of the default'
complete -c psql -s v -d 'Perform a variable assignment, like the set meta-command'
complete -c psql -o 'V
.br
--version' -d 'Print the psql version and exit'
complete -c psql -o 'w
.br
--no-password' -d 'Never issue a password prompt'
complete -c psql -o 'W
.br
--password' -d 'Force psql to prompt for a password before connecting to a database, even if …'
complete -c psql -o 'x
.br
--expanded' -d 'Turn on the expanded table formatting mode'
complete -c psql -s X -d 'Do not read the start-up file (neither the system-wide psqlrc file nor the us…'
complete -c psql -o 'z
.br
--field-separator-zero' -d 'Set the field separator for unaligned output to a zero byte'
complete -c psql -o '0
.br
--record-separator-zero' -d 'Set the record separator for unaligned output to a zero byte'
complete -c psql -o '1
.br
--single-transaction' -d 'This option can only be used in combination with one or more -c and/or -f opt…'
complete -c psql -o '?
.br
--help' -d 'Show help about psql and exit'
complete -c psql -s a
complete -c psql -l echo-all
complete -c psql -s A
complete -c psql -l no-align
complete -c psql -s b
complete -c psql -l echo-errors
complete -c psql -l command
complete -c psql -l dbname
complete -c psql -s e
complete -c psql -l echo-queries
complete -c psql -s E
complete -c psql -l echo-hidden
complete -c psql -l file
complete -c psql -s n -d 'had been specified)'
complete -c psql -l field-separator
complete -c psql -l host
complete -c psql -s H
complete -c psql -l html
complete -c psql -s l
complete -c psql -l list
complete -c psql -l log-file
complete -c psql -l no-readline
complete -c psql -l output
complete -c psql -l port
complete -c psql -l pset
complete -c psql -s q
complete -c psql -l quiet
complete -c psql -l record-separator
complete -c psql -s s
complete -c psql -l single-step
complete -c psql -s S
complete -c psql -l single-line
complete -c psql -s t
complete -c psql -l tuples-only
complete -c psql -l table-attr
complete -c psql -l username
complete -c psql -l set
complete -c psql -l variable
complete -c psql -s V
complete -c psql -l version
complete -c psql -s w
complete -c psql -l no-password
complete -c psql -s W
complete -c psql -l password
complete -c psql -s x
complete -c psql -l expanded
complete -c psql -l no-psqlrc
complete -c psql -s z
complete -c psql -l field-separator-zero
complete -c psql -s 0
complete -c psql -l record-separator-zero
complete -c psql -s 1
complete -c psql -l single-transaction
complete -c psql -s '?'
complete -c psql -l help
complete -c psql -o reuse-previous -d or
complete -c psql -s '>'
complete -c psql -l ------+---------+-----------+----------+--------- -d ' first  | integer |           | not null | 0  second | text    |           | …'
complete -c psql -l -----+-------- -d '     1 | one      2 | two      3 | three      4 | four (4 rows) You can displ…'
complete -c psql -l --- -l ---- -d '    1 one     2 two     3 three     4 four (4 rows)'
complete -c psql -l -----+--------+----- -d '     1 | one    | f      2 | two    | f      3 | three  | t      4 | four   |…'
complete -c psql -l -----+-----+-----+-------+------ -d '     1 | f   |     |       |       2 |     | f   |       |       3 |     |   …'
complete -c psql -l -+-----+-----+-----+----- -d ' 4 | 404 | 408 | 412 | 416  3 | 303 | 306 | 309 | 312  2 | 202 | 204 | 206 | …'
