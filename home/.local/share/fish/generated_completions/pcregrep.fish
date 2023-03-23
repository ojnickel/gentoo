# pcregrep
# Autogenerated from man page /usr/share/man/man1/pcregrep.1.bz2
complete -c pcregrep -s A -l after-context -d 'Output number lines of context after each matching line'
complete -c pcregrep -s a -l text -d 'Treat binary files as text.  This is equivalent to --binary-files=text'
complete -c pcregrep -s B -l before-context -d 'Output number lines of context before each matching line'
complete -c pcregrep -l binary-files -d 'Specify how binary files are to be processed'
complete -c pcregrep -l buffer-size -d 'Set the parameter that controls how much memory is used for buffering files t…'
complete -c pcregrep -s C -l context -d 'Output number lines of context both before and after each matching line'
complete -c pcregrep -s c -l count -d 'Do not output individual lines from the files that are being scanned; instead…'
complete -c pcregrep -l colour -l color -d 'If this option is given without any data, it is equivalent to "--colour=auto"'
complete -c pcregrep -s D -l devices -d 'If an input path is not a regular file or a directory, "action" specifies how…'
complete -c pcregrep -s d -l directories -d 'If an input path is a directory, "action" specifies how it is to be processed'
complete -c pcregrep -s e -l regex -l regexp -d 'Specify a pattern to be matched'
complete -c pcregrep -l exclude -d 'Files (but not directories) whose names match the pattern are skipped without…'
complete -c pcregrep -l exclude-from -d 'Treat each non-empty line of the file as the data for an --exclude option'
complete -c pcregrep -l exclude-dir -d 'Directories whose names match the pattern are skipped without being processed…'
complete -c pcregrep -s F -l fixed-strings -d 'Interpret each data-matching pattern as a list of fixed strings, separated by…'
complete -c pcregrep -s f -l file -d 'Read patterns from the file, one per line, and match them against each line o…'
complete -c pcregrep -l file-list -d 'Read a list of files and/or directories that are to be scanned from the given…'
complete -c pcregrep -l file-offsets -d 'Instead of showing lines or parts of lines that match, show each match as an …'
complete -c pcregrep -s H -l with-filename -d 'Force the inclusion of the filename at the start of output lines when searchi…'
complete -c pcregrep -s h -l no-filename -d 'Suppress the output filenames when searching multiple files'
complete -c pcregrep -l help -d 'Output a help message, giving brief details of the command options and file t…'
complete -c pcregrep -s I -d 'Treat binary files as never matching'
complete -c pcregrep -s i -l ignore-case -d 'Ignore upper/lower case distinctions during comparisons'
complete -c pcregrep -l include -d 'If any --include patterns are specified, the only files that are processed ar…'
complete -c pcregrep -l include-from -d 'Treat each non-empty line of the file as the data for an --include option'
complete -c pcregrep -l include-dir -d 'If any --include-dir patterns are specified, the only directories that are pr…'
complete -c pcregrep -s L -l files-without-match -d 'Instead of outputting lines from the files, just output the names of the file…'
complete -c pcregrep -s l -l files-with-matches -d 'Instead of outputting lines from the files, just output the names of the file…'
complete -c pcregrep -l label -d 'This option supplies a name to be used for the standard input when file names…'
complete -c pcregrep -l line-buffered -d 'When this option is given, input is read and processed line by line, and the …'
complete -c pcregrep -l line-offsets -d 'Instead of showing lines or parts of lines that match, show each match as a l…'
complete -c pcregrep -l locale -d 'This option specifies a locale to be used for pattern matching'
complete -c pcregrep -l match-limit -d 'Processing some regular expression patterns can require a very large amount o…'
complete -c pcregrep -s M -l multiline -d 'Allow patterns to match more than one line'
complete -c pcregrep -s N -l newline -d 'The PCRE library supports five different conventions for indicating the ends …'
complete -c pcregrep -s n -l line-number -d 'Precede each output line by its line number in the file, followed by a colon …'
complete -c pcregrep -l no-jit -d 'If the PCRE library is built with support for just-in-time compiling (which s…'
complete -c pcregrep -s o -l only-matching -d 'Show only the part of the line that matched a pattern instead of the whole li…'
complete -c pcregrep -o onumber -d 'Show only the part of the line that matched the capturing parentheses of the …'
complete -c pcregrep -l om-separator -d 'Specify a separating string for multiple occurrences of -o'
complete -c pcregrep -s q -l quiet -d 'Work quietly, that is, display nothing except error messages'
complete -c pcregrep -s r -l recursive -d 'If any given path is a directory, recursively scan the files it contains, tak…'
complete -c pcregrep -l recursion-limit -d 'See --match-limit above'
complete -c pcregrep -s s -l no-messages -d 'Suppress error messages about non-existent or unreadable files'
complete -c pcregrep -s u -l utf-8 -d 'Operate in UTF-8 mode'
complete -c pcregrep -s V -l version -d 'Write the version numbers of pcregrep and the PCRE library to the standard ou…'
complete -c pcregrep -s v -l invert-match -d 'Invert the sense of the match, so that lines which do not match any of the pa…'
complete -c pcregrep -s w -l word-regex -l word-regexp -d 'Force the patterns to match only whole words'
complete -c pcregrep -s x -d 'given any number of times.  If a directory matches both --include-dir and'
complete -c pcregrep -l line-regex -l line-regexp -d 'Force the patterns to be anchored (each must start matching at the beginning …'
complete -c pcregrep -l xxx-regexp -l xxx-regex -d '(PCRE terminology).  However, the --file-list, --file-offsets,'

