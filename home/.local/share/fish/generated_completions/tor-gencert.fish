# tor-gencert
# Autogenerated from man page /usr/share/man/man1/tor-gencert.1.bz2
complete -c tor-gencert -s v -d 'Display verbose output'
complete -c tor-gencert -s h -l help -d 'Display help text and exit'
complete -c tor-gencert -s r -l reuse -d 'Generate a new certificate, but not a new signing key'
complete -c tor-gencert -l create-identity-key -d 'Generate a new identity key'
complete -c tor-gencert -s i -d 'Read the identity key from the specified file'
complete -c tor-gencert -s s -d 'Write the signing key to the specified file.  Default: "'
complete -c tor-gencert -s c -d 'Write the certificate to the specified file.  Default: "'
complete -c tor-gencert -s m -d 'Number of months that the certificate should be valid.  Default: 12'
complete -c tor-gencert -l passphrase-fd -d 'Filedescriptor to read the passphrase from.  Ends at the first NUL or newline'
complete -c tor-gencert -s a -d 'If provided, advertise the address:port combination as this authority\'s prefe…'

