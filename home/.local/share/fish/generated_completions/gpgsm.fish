# gpgsm
# Autogenerated from man page /usr/share/man/man1/gpgsm.1.bz2
complete -c gpgsm -l options -d 'Reads configuration from file instead of from the default per-user configurat…'
complete -c gpgsm -l homedir -d 'Set the name of the home directory to dir'
complete -c gpgsm -l verbose -d 'Outputs additional information while running'
complete -c gpgsm -l keyserver -d 'This is a deprecated option.   It was used to add an LDAP server to use for X'
complete -c gpgsm -l policy-file -d 'Change the default name of the policy file to filename'
complete -c gpgsm -l agent-program -d 'Specify an agent program to be used for secret key operations'
complete -c gpgsm -l dirmngr-program -d 'Specify a dirmngr program to be used for CRL checks'
complete -c gpgsm -l prefer-system-dirmngr -d 'This option is obsolete and ignored'
complete -c gpgsm -l disable-dirmngr -d 'Entirely disable the use of the Dirmngr'
complete -c gpgsm -l no-autostart -d 'Do not start the gpg-agent or the dirmngr if it has not yet been started and …'
complete -c gpgsm -l no-secmem-warning -d 'Do not print a warning when the so called "secure memory" cannot be used'
complete -c gpgsm -l log-file -d 'When running in server mode, append all logging output to file'
complete -c gpgsm -l enable-policy-checks -d 'TQ   --disable-policy-checks By default policy checks are enabled'
complete -c gpgsm -l enable-crl-checks -d 'TQ   --disable-crl-checks By default the CRL checks are enabled and the DirMn…'
complete -c gpgsm -l enable-trusted-cert-crl-check -d 'TQ   --disable-trusted-cert-crl-check By default the CRL for trusted root cer…'
complete -c gpgsm -l force-crl-refresh -d 'Tell the dirmngr to reload the CRL for each request'
complete -c gpgsm -l enable-issuer-based-crl-check -d 'Run a CRL check even for certificates which do not have any CRL distribution …'
complete -c gpgsm -l enable-ocsp -d 'TQ   --disable-ocsp By default OCSP checks are disabled'
complete -c gpgsm -l auto-issuer-key-retrieve -d 'If a required certificate is missing while validating the chain of certificat…'
complete -c gpgsm -l validation-model -d 'This option changes the default validation model'
complete -c gpgsm -l ignore-cert-extension -d 'Add oid to the list of ignored certificate extensions'
complete -c gpgsm -l armor -d 'TQ   -a Create PEM encoded output.   Default is binary output'
complete -c gpgsm -l base64 -d 'Create Base-64 encoded output; i. e.  PEM without the header lines'
complete -c gpgsm -l assume-armor -d 'Assume the input data is PEM encoded'
complete -c gpgsm -l assume-base64 -d 'Assume the input data is plain base-64 encoded'
complete -c gpgsm -l assume-binary -d 'Assume the input data is binary encoded'
complete -c gpgsm -l p12-charset -d 'gpgsm uses the UTF-8 encoding when encoding passphrases for PKCS#12 files'
complete -c gpgsm -l default-key -d 'Use user_id as the standard key for signing'
complete -c gpgsm -s u -d 'Set the user(s) to be used for signing'
complete -c gpgsm -l recipient -d 'TQ   -r Encrypt to the user id name'
complete -c gpgsm -l output -d 'TQ   -o file Write output to file.   The default is to write it to stdout'
complete -c gpgsm -l with-key-data -d 'Displays extra information with the --list-keys commands'
complete -c gpgsm -l with-validation -d 'When doing a key listing, do a full validation check for each key and print t…'
complete -c gpgsm -l with-md5-fingerprint -d 'For standard key listings, also print the MD5 fingerprint of the certificate'
complete -c gpgsm -l with-keygrip -d 'Include the keygrip in standard key listings'
complete -c gpgsm -l with-secret -d 'Include info about the presence of a secret key in public key listings done w…'
complete -c gpgsm -l include-certs -d 'Using n of -2 includes all certificate except for the root cert, -1 includes …'
complete -c gpgsm -l cipher-algo -d 'Use the cipher algorithm with the ASN. 1 object identifier oid for encryption'
complete -c gpgsm -l digest-algo -d 'Use name as the message digest algorithm'
complete -c gpgsm -l extra-digest-algo -d 'Sometimes signatures are broken in that they announce a different digest algo…'
complete -c gpgsm -l compliance -d 'Set the compliance mode'
complete -c gpgsm -l min-rsa-length -d 'This option adjusts the compliance mode "de-vs" for stricter key size require…'
complete -c gpgsm -l require-compliance -d 'To check that data has been encrypted according to the rules of the current c…'
complete -c gpgsm -l ignore-cert-with-oid -d 'Add oid to the list of OIDs to be checked while reading certificates from sma…'
complete -c gpgsm -l faked-system-time -d 'This option is only useful for testing; it sets the system time back or forth…'
complete -c gpgsm -l with-ephemeral-keys -d 'Include ephemeral flagged keys in the output of key listings'
complete -c gpgsm -l compatibility-flags -d 'Set compatibility flags to work around problems due to non-compliant certific…'
complete -c gpgsm -l debug-level -d 'Select the debug level for investigating problems'
complete -c gpgsm -l debug -d 'This option is only useful for debugging and the behaviour may change at any …'
complete -c gpgsm -l debug-all -d 'Same as --debug=0xffffffff'
complete -c gpgsm -l debug-allow-core-dump -d 'Usually gpgsm tries to avoid dumping core by well written code and by disabli…'
complete -c gpgsm -l debug-no-chain-validation -d 'This is actually not a debugging option but only useful as such'
complete -c gpgsm -l debug-ignore-expiration -d 'This is actually not a debugging option but only useful as such'
complete -c gpgsm -l passphrase-fd -d 'Read the passphrase from file descriptor n'
complete -c gpgsm -l pinentry-mode -d 'Set the pinentry mode to mode.   Allowed values for mode are: . RS'
complete -c gpgsm -l request-origin -d 'Tell gpgsm to assume that the operation ultimately originated at origin'
complete -c gpgsm -l version -d 'Print the program version and licensing information'
complete -c gpgsm -l help -s h -d 'Print a usage message summarizing the most useful command-line options'
complete -c gpgsm -l warranty -d 'Print warranty information.   Note that you cannot abbreviate this command'
complete -c gpgsm -l dump-options -d 'Print a list of all available options and commands'
complete -c gpgsm -l encrypt -d 'Perform an encryption'
complete -c gpgsm -l decrypt -d 'Perform a decryption; the type of input is automatically determined'
complete -c gpgsm -l sign -d 'Create a digital signature'
complete -c gpgsm -l verify -d 'Check a signature file for validity'
complete -c gpgsm -l server -d 'Run in server mode and wait for commands on the stdin'
complete -c gpgsm -l call-dirmngr -d 'Behave as a Dirmngr client issuing the request command with the optional list…'
complete -c gpgsm -l call-protect-tool -d 'Certain maintenance operations are done by an external program call gpg-prote…'
complete -c gpgsm -l generate-key
complete -c gpgsm -l gen-key -d 'This command allows the creation of a certificate signing request or a self-s…'
complete -c gpgsm -l list-keys
complete -c gpgsm -s k -d 'List all available certificates stored in the local key database'
complete -c gpgsm -l list-secret-keys
complete -c gpgsm -s K -d 'List all available certificates for which a corresponding a secret key is ava…'
complete -c gpgsm -l list-external-keys -d 'List certificates matching pattern using an external server'
complete -c gpgsm -l list-chain -d 'Same as --list-keys but also prints all keys making up the chain'
complete -c gpgsm -l dump-cert
complete -c gpgsm -l dump-keys -d 'List all available certificates stored in the local key database using a form…'
complete -c gpgsm -l dump-chain -d 'Same as --dump-keys but also prints all keys making up the chain'
complete -c gpgsm -l dump-secret-keys -d 'List all available certificates for which a corresponding a secret key is ava…'
complete -c gpgsm -l dump-external-keys -d 'List certificates matching pattern using an external server'
complete -c gpgsm -l keydb-clear-some-cert-flags -d 'This is a debugging aid to reset certain flags in the key database which are …'
complete -c gpgsm -l delete-keys -d 'Delete the keys matching pattern'
complete -c gpgsm -l export -d 'Export all certificates stored in the Keybox or those specified by the option…'
complete -c gpgsm -l export-secret-key-p12 -d 'Export the private key and the certificate identified by key-id using the PKC…'
complete -c gpgsm -l export-secret-key-p8
complete -c gpgsm -l export-secret-key-raw -d 'Export the private key of the certificate identified by key-id with any encry…'
complete -c gpgsm -l import -d 'Import the certificates from the PEM or binary encoded files as well as from …'
complete -c gpgsm -l learn-card -d 'Read information about the private keys from the smartcard and import the cer…'
complete -c gpgsm -l change-passphrase
complete -c gpgsm -l passwd -d 'Change the passphrase of the private key belonging to the certificate specifi…'
complete -c gpgsm -s v
complete -c gpgsm -l disable-policy-checks -d 'By default policy checks are enabled'
complete -c gpgsm -l disable-crl-checks -d 'By default the CRL checks are enabled and the DirMngr is used to check for re…'
complete -c gpgsm -l disable-trusted-cert-crl-check -d 'By default the CRL for trusted root certificates are checked like for any oth…'
complete -c gpgsm -l disable-ocsp -d 'By default OCSP checks are disabled'
complete -c gpgsm -l allow-ocsp -d 'so you will get the error code `Not supported\''
complete -c gpgsm -s a -d 'Create PEM encoded output.   Default is binary output'
complete -c gpgsm -l local-users -d 'set; however --default-key always overrides this'
complete -c gpgsm -l local-user
complete -c gpgsm -s r -d 'Encrypt to the user id name'
complete -c gpgsm -s o -d 'Write output to file.   The default is to write it to stdout'
complete -c gpgsm -s 1 -d 'signers cert and all other positive values include up to n certificates start…'
complete -c gpgsm -l no-common-certs-import -d 'Suppress the import of common certificates on keybox creation'

