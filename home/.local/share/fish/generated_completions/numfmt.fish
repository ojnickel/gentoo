# numfmt
# Autogenerated from man page /usr/share/man/man1/numfmt.1.bz2
complete -c numfmt -l debug -d 'print warnings about invalid input'
complete -c numfmt -s d -l delimiter -d 'use X instead of whitespace for field delimiter'
complete -c numfmt -l field -d 'replace the numbers in these input fields (default=1); see FIELDS below'
complete -c numfmt -l format -d 'use printf style floating-point FORMAT; see FORMAT below for details'
complete -c numfmt -l from -d 'auto-scale input numbers to UNITs; default is \'none\'; see UNIT below'
complete -c numfmt -l from-unit -d 'specify the input unit size (instead of the default 1)'
complete -c numfmt -l grouping -d 'use locale-defined grouping of digits, e. g'
complete -c numfmt -l header -d 'print (without converting) the first N header lines; N defaults to 1 if not s…'
complete -c numfmt -l invalid -d 'failure mode for invalid numbers: MODE can be: abort (default), fail, warn, i…'
complete -c numfmt -l padding -d 'pad the output to N characters; positive N will right-align; negative N will …'
complete -c numfmt -l round -d 'use METHOD for rounding when scaling; METHOD can be: up, down, from-zero (def…'
complete -c numfmt -l suffix -d 'add SUFFIX to output numbers, and accept optional SUFFIX in input numbers'
complete -c numfmt -l to -d 'auto-scale output numbers to UNITs; see UNIT below'
complete -c numfmt -l to-unit -d 'the output unit size (instead of the default 1)'
complete -c numfmt -s z -l zero-terminated -d 'line delimiter is NUL, not newline'
complete -c numfmt -l help -d 'display this help and exit'
complete -c numfmt -l version -d 'output version information and exit . SS "UNIT options:"'
complete -c numfmt -s M -d 'from first to M\'th field (inclusive)'
complete -c numfmt -s '>' -d '$ numfmt --to=iec 2048'

