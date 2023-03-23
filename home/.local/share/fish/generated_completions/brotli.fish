# brotli
# Autogenerated from man page /usr/share/man/man1/brotli.1.bz2
complete -c brotli -l decompress -d 'o 2'
complete -c brotli -l test -d '"--decompress --stdout" except that the decompressed data is discarded instea…'
complete -c brotli -s '#' -d '  compression level (0-9); bigger values cause denser, but slower compression…'
complete -c brotli -s c -l stdout -d '  write on standard output o 2'
complete -c brotli -s d -d '  decompress mode o 2'
complete -c brotli -s f -l force -d '  force output file overwrite o 2'
complete -c brotli -s h -l help -d '  display this help and exit o 2'
complete -c brotli -s j -l rm -d '  remove source file(s); gzip (1)-like behaviour o 2'
complete -c brotli -s k -l keep -d '  keep source file(s); zstd (1)-like behaviour o 2'
complete -c brotli -s n -l no-copy-stat -d '  do not copy source file(s) attributes o 2'
complete -c brotli -s o -l output -d '  output file; valid only if there is a single input entry o 2'
complete -c brotli -s q -l quality -d '  compression level (0-11); bigger values cause denser, but slower compressio…'
complete -c brotli -s t -d '  test file integrity mode o 2'
complete -c brotli -s v -l verbose -d '  increase output verbosity o 2'
complete -c brotli -s w -l lgwin -d '  set LZ77 window size (0, 10-24) (default: 22); window size is   (2**NUM - 1…'
complete -c brotli -s S -l suffix -d '  output file suffix (default: . br) o 2'
complete -c brotli -s V -l version -d '  display version and exit o 2'
complete -c brotli -s Z -l best -d '  use best compression level (default); same as "-q 11" SEE ALSO'

