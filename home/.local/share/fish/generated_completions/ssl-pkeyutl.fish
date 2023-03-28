# ssl-pkeyutl
# Autogenerated from man page /usr/share/man/man1/ssl-pkeyutl.1ssl.bz2
complete -c ssl-pkeyutl -o help -d 'Print out a usage message'
complete -c ssl-pkeyutl -o in -d 'This specifies the input filename to read data from or standard input if this…'
complete -c ssl-pkeyutl -o out -d 'Specifies the output filename to write to or standard output by default'
complete -c ssl-pkeyutl -o sigfile -d 'Signature file, required for verify operations only'
complete -c ssl-pkeyutl -o inkey -d 'The input key file, by default it should be a private key'
complete -c ssl-pkeyutl -o keyform -d 'The key format \\s-1PEM, DER\\s0 or \\s-1ENGINE. \\s0 Default is \\s-1PEM. \\s0'
complete -c ssl-pkeyutl -o passin -d 'The input key password source'
complete -c ssl-pkeyutl -o peerkey -d 'The peer key file, used by key derivation (agreement) operations'
complete -c ssl-pkeyutl -o peerform -d 'The peer key format \\s-1PEM, DER\\s0 or \\s-1ENGINE. \\s0 Default is \\s-1PEM'
complete -c ssl-pkeyutl -o pubin -d 'The input file is a public key'
complete -c ssl-pkeyutl -o certin -d 'The input is a certificate containing a public key'
complete -c ssl-pkeyutl -o rev -d 'Reverse the order of the input buffer'
complete -c ssl-pkeyutl -o sign -d 'Sign the input data (which must be a hash) and output the signed result'
complete -c ssl-pkeyutl -o verify -d 'Verify the input data (which must be a hash) against the signature file and i…'
complete -c ssl-pkeyutl -o verifyrecover -d 'Verify the input data (which must be a hash) and output the recovered data'
complete -c ssl-pkeyutl -o encrypt -d 'Encrypt the input data using a public key'
complete -c ssl-pkeyutl -o decrypt -d 'Decrypt the input data using a private key'
complete -c ssl-pkeyutl -o derive -d 'Derive a shared secret using the peer key'
complete -c ssl-pkeyutl -o kdf -d 'Use key derivation function algorithm'
complete -c ssl-pkeyutl -o kdflen -d 'Set the output length for \\s-1KDF. \\s0'
complete -c ssl-pkeyutl -o pkeyopt -d 'Public key options specified as opt:value'
complete -c ssl-pkeyutl -o hexdump -d 'hex dump the output data'
complete -c ssl-pkeyutl -o asn1parse -d 'Parse the \\s-1ASN'
complete -c ssl-pkeyutl -o rand -d 'A file or files containing random data used to seed the random number generat…'
complete -c ssl-pkeyutl -o writerand -d 'Writes random data to the specified file upon exit'
complete -c ssl-pkeyutl -o engine -d 'Specifying an engine (by its unique id string) will cause pkeyutl to attempt …'
