# rg
# Autogenerated from man page /usr/share/man/man1/rg.1.bz2
complete -c rg -s A -l after-context -d 'Show NUM lines after each match'
complete -c rg -l auto-hybrid-regex -d 'DEPRECATED.  Use --engine instead'
complete -c rg -s B -l before-context -d 'Show NUM lines before each match'
complete -c rg -l binary -d 'Enabling this flag will cause ripgrep to search binary files'
complete -c rg -l block-buffered -d 'When enabled, ripgrep will use block buffering'
complete -c rg -s b -l byte-offset -d 'Print the 0-based byte offset within the input file before each line of output'
complete -c rg -s s -l case-sensitive -d 'Search case sensitively'
complete -c rg -l color -d 'This flag controls when to use colors'
complete -c rg -l colors -d 'This flag specifies color settings for use in the output'
complete -c rg -l column -d 'Show column numbers (1-based)'
complete -c rg -s C -l context -d 'Show NUM lines before and after each match'
complete -c rg -l context-separator -d 'The string used to separate non-contiguous context lines in the output'
complete -c rg -s c -l count -d 'This flag suppresses normal output and shows the number of lines that match t…'
complete -c rg -l count-matches -d 'This flag suppresses normal output and shows the number of individual matches…'
complete -c rg -l crlf -d 'When enabled, ripgrep will treat CRLF (rn) as a line terminator instead of ju…'
complete -c rg -l debug -d 'Show debug messages.  Please use this when filing a bug report'
complete -c rg -l dfa-size-limit -d 'The upper size limit of the regex DFA.  The default limit is 10M'
complete -c rg -s E -l encoding -d 'Specify the text encoding that ripgrep will use on all files searched'
complete -c rg -l engine -d 'Specify which regular expression engine to use'
complete -c rg -l field-context-separator -d 'Set the field context separator, which is used to delimit file paths, line nu…'
complete -c rg -l field-match-separator -d 'Set the field match separator, which is used to delimit file paths, line numb…'
complete -c rg -s f -l file -d 'Search for patterns from the given file, with one pattern per line'
complete -c rg -l files -d 'Print each file that would be searched without actually performing the search'
complete -c rg -s l -l files-with-matches -d 'Print the paths with at least one match and suppress match contents'
complete -c rg -l files-without-match -d 'Print the paths that contain zero matches and suppress match contents'
complete -c rg -s F -l fixed-strings -d 'Treat the pattern as a literal string instead of a regular expression'
complete -c rg -s L -l follow -d 'When this flag is enabled, ripgrep will follow symbolic links while traversin…'
complete -c rg -s g -l glob -d 'Include or exclude files and directories for searching that match the given g…'
complete -c rg -l glob-case-insensitive -d 'Process glob patterns given with the -g/--glob flag case insensitively'
complete -c rg -l heading -d 'This flag prints the file path above clusters of matches from each file inste…'
complete -c rg -l hidden -d 'Search hidden files and directories'
complete -c rg -l iglob -d 'Include or exclude files and directories for searching that match the given g…'
complete -c rg -s i -l ignore-case -d 'When this flag is provided, the given patterns will be searched case insensit…'
complete -c rg -l ignore-file -d 'Specifies a path to one or more . gitignore format rules files'
complete -c rg -l ignore-file-case-insensitive -d 'Process ignore files (. gitignore, . ignore, etc. ) case insensitively'
complete -c rg -l include-zero -d 'When used with --count or --count-matches, print the number of matches for ea…'
complete -c rg -s v -l invert-match -d 'Invert matching.  Show lines that do not match the given patterns'
complete -c rg -l json -d 'Enable printing results in a JSON Lines format'
complete -c rg -l line-buffered -d 'When enabled, ripgrep will use line buffering'
complete -c rg -s n -l line-number -d 'Show line numbers (1-based)'
complete -c rg -s x -l line-regexp -d 'Only show matches surrounded by line boundaries'
complete -c rg -s M -l max-columns -d 'Don\'t print lines longer than this limit in bytes'
complete -c rg -l max-columns-preview -d 'When the --max-columns flag is used, ripgrep will by default completely repla…'
complete -c rg -s m -l max-count -d 'Limit the number of matching lines per file searched to NUM'
complete -c rg -l max-depth -d 'Limit the depth of directory traversal to NUM levels beyond the paths given'
complete -c rg -l max-filesize -d 'Ignore files larger than NUM in size.  This does not apply to directories'
complete -c rg -l mmap -d 'Search using memory maps when possible'
complete -c rg -s U -l multiline -d 'Enable matching across multiple lines'
complete -c rg -l multiline-dotall -d 'This flag enables "dot all" in your regex pattern, which causes '
complete -c rg -l no-config -d 'Never read configuration files'
complete -c rg -s I -l no-filename -d 'Never print the file path with the matched lines'
complete -c rg -l no-heading -d 'Don\'t group matches by each file'
complete -c rg -l no-ignore -d 'Don\'t respect ignore files (. gitignore, . ignore, etc. )'
complete -c rg -l no-ignore-dot -d 'Don\'t respect . ignore files'
complete -c rg -l no-ignore-exclude -d 'Don\'t respect ignore files that are manually configured for the repository su…'
complete -c rg -l no-ignore-files -d 'When set, any --ignore-file flags, even ones that come after this flag, are i…'
complete -c rg -l no-ignore-global -d 'Don\'t respect ignore files that come from "global" sources such as git\'s core'
complete -c rg -l no-ignore-messages -d 'Suppresses all error messages related to parsing ignore files such as '
complete -c rg -l no-ignore-parent -d 'Don\'t respect ignore files (. gitignore, . ignore, etc'
complete -c rg -l no-ignore-vcs -d 'Don\'t respect version control ignore files (. gitignore, etc. )'
complete -c rg -s N -l no-line-number -d 'Suppress line numbers'
complete -c rg -l no-messages -d 'Suppress all error messages related to opening and reading files'
complete -c rg -l no-mmap -d 'Never use memory maps, even when they might be faster'
complete -c rg -l no-pcre2-unicode -d 'DEPRECATED.  Use --no-unicode instead'
complete -c rg -l no-require-git -d 'By default, ripgrep will only respect global gitignore rules, '
complete -c rg -l no-unicode -d 'By default, ripgrep will enable "Unicode mode" in all of its regexes'
complete -c rg -s 0 -l null -d 'Whenever a file path is printed, follow it with a NUL byte'
complete -c rg -l null-data -d 'Enabling this option causes ripgrep to use NUL as a line terminator instead o…'
complete -c rg -l one-file-system -d 'When enabled, ripgrep will not cross file system boundaries relative to where…'
complete -c rg -s o -l only-matching -d 'Print only the matched (non-empty) parts of a matching line, with each such p…'
complete -c rg -l passthru -d 'Print both matching and non-matching lines'
complete -c rg -l path-separator -d 'Set the path separator to use when printing file paths'
complete -c rg -s P -l pcre2 -d 'When this flag is present, ripgrep will use the PCRE2 regex engine instead of…'
complete -c rg -l pcre2-version -d 'When this flag is present, ripgrep will print the version of PCRE2 in use, al…'
complete -c rg -l pre -d 'For each input FILE, search the standard output of COMMAND FILE rather than t…'
complete -c rg -l pre-glob -d 'This flag works in conjunction with the --pre flag'
complete -c rg -s p -l pretty -d 'This is a convenience alias for --color always --heading --line-number'
complete -c rg -s q -l quiet -d 'Do not print anything to stdout'
complete -c rg -l regex-size-limit -d 'The upper size limit of the compiled regex.  The default limit is 10M'
complete -c rg -s e -l regexp -d 'A pattern to search for'
complete -c rg -s r -l replace -d 'Replace every match with the text given when printing results'
complete -c rg -s z -l search-zip -d 'Search in compressed files'
complete -c rg -s S -l smart-case -d 'Searches case insensitively if the pattern is all lowercase'
complete -c rg -l sort -d 'This flag enables sorting of results in ascending order'
complete -c rg -l sortr -d 'This flag enables sorting of results in descending order'
complete -c rg -l stats -d 'Print aggregate statistics about this ripgrep search'
complete -c rg -s a -l text -d 'Search binary files as if they were text'
complete -c rg -s j -l threads -d 'The approximate number of threads to use'
complete -c rg -l trim -d 'When set, all ASCII whitespace at the beginning of each line printed will be …'
complete -c rg -s t -l type -d 'Only search files matching TYPE.  Multiple type flags may be provided'
complete -c rg -l type-add -d 'Add a new glob for a particular file type'
complete -c rg -l type-clear -d 'Clear the file type globs previously defined for TYPE'
complete -c rg -l type-list -d 'Show all supported file types and their corresponding globs'
complete -c rg -s T -l type-not -d 'Do not search files matching TYPE.  Multiple type-not flags may be provided'
complete -c rg -s u -l unrestricted -d 'Reduce the level of "smart" searching.  A single -u won\'t respect '
complete -c rg -l vimgrep -d 'Show results with every match on its own line, including line numbers and col…'
complete -c rg -s H -l with-filename -d 'Display the file path for matches'
complete -c rg -s w -l word-regexp -d 'Only show matches surrounded by word boundaries'
complete -c rg -o a/--text -d flag
complete -c rg -o u/--unrestricted -d 'flag is provided for a third time, then this flag is automatically enabled'
complete -c rg -l no-binary
complete -c rg -l no-max-columns-preview
complete -c rg -o xdev -d or
complete -c rg -o mount -d flag
complete -c rg -o U/--multiline -d 'flag, then ripgrep will silently fail to match anything instead of reporting …'
complete -c rg -l no-pre -d 'flag will disable this behavior'
complete -c rg -o foo -d 'rg -e -foo You can also use the special'
complete -c rg -l no-text
complete -c rg -o './--hidden' -d 'will force ripgrep to search hidden files and directories.  oc o 2. 3'
complete -c rg -o L/--follow -d 'will force ripgrep to follow symlinks'
complete -c rg -o uu -d 'is equivalent to'
complete -c rg -o uuu -d 'is equivalent to'

