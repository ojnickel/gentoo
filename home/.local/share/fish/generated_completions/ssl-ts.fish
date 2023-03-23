# ssl-ts
# Autogenerated from man page /usr/share/man/man1/ssl-ts.1ssl.bz2
complete -c ssl-ts -o rand -d 'A file or files containing random data used to seed the random number generat…'
complete -c ssl-ts -o writerand -d 'Writes random data to the specified file upon exit'
complete -c ssl-ts -o config -d 'The configuration file to use'
complete -c ssl-ts -o data -d 'The data file for which the timestamp request needs to be created'
complete -c ssl-ts -o digest -d 'It is possible to specify the message imprint explicitly without the data file'
complete -c ssl-ts -o tspolicy -d 'The policy that the client expects the \\s-1TSA\\s0 to use for creating the tim…'
complete -c ssl-ts -o no_nonce -d 'No nonce is specified in the request if this option is given'
complete -c ssl-ts -o cert -d 'The \\s-1TSA\\s0 is expected to include its signing certificate in the response'
complete -c ssl-ts -o in -d 'This option specifies a previously created timestamp request in \\s-1DER\\s0 fo…'
complete -c ssl-ts -o out -d 'Name of the output file to which the request will be written'
complete -c ssl-ts -o text -d 'If this option is specified the output is human-readable text format instead …'
complete -c ssl-ts -o section -d 'The name of the config file section containing the settings for the response …'
complete -c ssl-ts -o queryfile -d 'The name of the file containing a \\s-1DER\\s0 encoded timestamp request'
complete -c ssl-ts -o passin -d 'Specifies the password source for the private key of the \\s-1TSA'
complete -c ssl-ts -o signer -d 'The signer certificate of the \\s-1TSA\\s0 in \\s-1PEM\\s0 format'
complete -c ssl-ts -o inkey -d 'The signer private key of the \\s-1TSA\\s0 in \\s-1PEM\\s0 format'
complete -c ssl-ts -o chain -d 'The collection of certificates in \\s-1PEM\\s0 format that will all be included…'
complete -c ssl-ts -o token_in -d 'This flag can be used together with the -in option and indicates that the inp…'
complete -c ssl-ts -o token_out -d 'The output is a timestamp token (ContentInfo) instead of timestamp response (…'
complete -c ssl-ts -o engine -d 'Specifying an engine (by its unique id string) will cause ts to attempt to ob…'
complete -c ssl-ts -o CApath -d 'The name of the directory containing the trusted \\s-1CA\\s0 certificates of th…'
complete -c ssl-ts -o CAfile -d 'The name of the file containing a set of trusted self-signed \\s-1CA\\s0 certif…'
complete -c ssl-ts -o untrusted -d 'Set of additional untrusted certificates in \\s-1PEM\\s0 format which may be ne…'

