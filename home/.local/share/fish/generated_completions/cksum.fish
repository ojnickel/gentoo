# cksum
# Autogenerated from man page /usr/share/man/man1/cksum.1.bz2
complete -c cksum -s a -l algorithm -d 'select the digest type to use.   See DIGEST below'
complete -c cksum -s c -l check -d 'read checksums from the FILEs and check them'
complete -c cksum -s l -l length -d 'digest length in bits; must not exceed the max for the blake2 algorithm and m…'
complete -c cksum -l tag -d 'create a BSD-style checksum (the default)'
complete -c cksum -l untagged -d 'create a reversed style checksum, without digest type'
complete -c cksum -s z -l zero -d 'end each output line with NUL, not newline, and disable file name escaping '
complete -c cksum -l ignore-missing -d 'don\'t fail or report status for missing files'
complete -c cksum -l quiet -d 'don\'t print OK for each successfully verified file'
complete -c cksum -l status -d 'don\'t output anything, status code shows success'
complete -c cksum -l strict -d 'exit non-zero for improperly formatted checksum lines'
complete -c cksum -s w -l warn -d 'warn about improperly formatted checksum lines'
complete -c cksum -l debug -d 'indicate which implementation used'
complete -c cksum -l help -d 'display this help and exit'
complete -c cksum -l version -d 'output version information and exit '

