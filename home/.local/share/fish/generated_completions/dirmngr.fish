# dirmngr
# Autogenerated from man page /usr/share/man/man8/dirmngr.8.bz2
complete -c dirmngr -l options -d 'Reads configuration from file instead of from the default per-user configurat…'
complete -c dirmngr -l homedir -d 'Set the name of the home directory to dir'
complete -c dirmngr -l verbose -d 'Outputs additional information while running'
complete -c dirmngr -l log-file -d 'Append all logging output to file'
complete -c dirmngr -l debug-level -d 'Select the debug level for investigating problems'
complete -c dirmngr -l debug -d 'Set debugging flags'
complete -c dirmngr -l debug-all -d 'Same as --debug=0xffffffff'
complete -c dirmngr -l tls-debug -d 'Enable debugging of the TLS layer at level'
complete -c dirmngr -l debug-wait -d 'When running in server mode, wait n seconds before entering the actual proces…'
complete -c dirmngr -l disable-check-own-socket -d 'On some platforms dirmngr is able to detect the removal of its socket file an…'
complete -c dirmngr -s s -d 'TQ   --sh . TQ   -c '
complete -c dirmngr -l force -d 'Enabling this option forces loading of expired CRLs; this is only useful for …'
complete -c dirmngr -l use-tor -d 'TQ   --no-use-tor The option --use-tor switches Dirmngr and thus GnuPG into `…'
complete -c dirmngr -l standard-resolver -d 'This option forces the use of the system\'s standard DNS resolver code'
complete -c dirmngr -l recursive-resolver -d 'When possible use a recursive resolver instead of a stub resolver'
complete -c dirmngr -l resolver-timeout -d 'Set the timeout for the DNS resolver to N seconds'
complete -c dirmngr -l connect-quick-timeout -d 'Set the timeout for HTTP and generic TCP connection attempts to N seconds'
complete -c dirmngr -l listen-backlog -d 'Set the size of the queue for pending connections.   The default is 64'
complete -c dirmngr -l allow-version-check -d 'Allow Dirmngr to connect to https://versions. gnupg'
complete -c dirmngr -l keyserver -d 'Use name as your keyserver'
complete -c dirmngr -l nameserver -d 'In ``Tor mode\'\' Dirmngr uses a public resolver via Tor to resolve DNS names'
complete -c dirmngr -l disable-ipv6 -d 'Disable the use of all IPv4 or IPv6 addresses'
complete -c dirmngr -l disable-ldap -d 'Entirely disables the use of LDAP'
complete -c dirmngr -l disable-http -d 'Entirely disables the use of HTTP'
complete -c dirmngr -l ignore-http-dp -d 'When looking for the location of a CRL, the to be tested certificate usually …'
complete -c dirmngr -l ignore-ldap-dp -d 'This is similar to --ignore-http-dp but ignores entries using the LDAP scheme'
complete -c dirmngr -l ignore-ocsp-service-url -d 'Ignore all OCSP URLs contained in the certificate'
complete -c dirmngr -l honor-http-proxy -d 'If the environment variable \\(oqhttp_proxy\' has been set, use its value to ac…'
complete -c dirmngr -l http-proxy -d 'Use host and port to access HTTP servers'
complete -c dirmngr -l ldap-proxy -d 'Use host and port to connect to LDAP servers'
complete -c dirmngr -l only-ldap-proxy -d 'Never use anything else but the LDAP "proxy" as configured with --ldap-proxy'
complete -c dirmngr -l ldapserverlist-file -d 'Read the list of LDAP servers to consult for CRLs and X'
complete -c dirmngr -l ldapserver -d 'This is an alternative way to specify LDAP servers for CRL and X'
complete -c dirmngr -l ldaptimeout -d 'Specify the number of seconds to wait for an LDAP query before timing out'
complete -c dirmngr -l add-servers -d 'This option makes dirmngr add any servers it discovers when validating certif…'
complete -c dirmngr -l allow-ocsp -d 'This option enables OCSP support if requested by the client'
complete -c dirmngr -l ocsp-responder -d 'Use url as the default OCSP Responder if the certificate does not contain inf…'
complete -c dirmngr -l ocsp-signer -d 'Use the certificate with the fingerprint fpr to check the responses of the de…'
complete -c dirmngr -l ocsp-max-clock-skew -d 'The number of seconds a skew between the OCSP responder and them local clock …'
complete -c dirmngr -l ocsp-max-period -d 'Seconds a response is at maximum considered valid after the time given in the…'
complete -c dirmngr -l ocsp-current-period -d 'The number of seconds an OCSP response is considered valid after the time giv…'
complete -c dirmngr -l max-replies -d 'Do not return more that n items in one query.   The default is 10'
complete -c dirmngr -l ignore-cert-extension -d 'Add oid to the list of ignored certificate extensions'
complete -c dirmngr -l ignore-cert -d 'Entirely ignore certificates with the fingerprint fpr'
complete -c dirmngr -l version -d 'Print the program version and licensing information'
complete -c dirmngr -l help -s h -d 'Print a usage message summarizing the most useful command-line options'
complete -c dirmngr -l dump-options -d 'Print a list of all available options and commands'
complete -c dirmngr -l server -d 'Run in server mode and wait for commands on the stdin'
complete -c dirmngr -l daemon -d 'Run in background daemon mode and listen for commands on a socket'
complete -c dirmngr -l supervised -d 'Run in the foreground, sending logs to stderr, and listening on file descript…'
complete -c dirmngr -l list-crls -d 'List the contents of the CRL cache on stdout'
complete -c dirmngr -l load-crl -d 'This command requires a filename as additional argument, and it will make Dir…'
complete -c dirmngr -l fetch-crl -d 'This command requires an URL as additional argument, and it will make dirmngr…'
complete -c dirmngr -l shutdown -d 'This commands shuts down an running instance of Dirmngr'
complete -c dirmngr -l flush -d 'This command removes all CRLs from Dirmngr\'s cache'
complete -c dirmngr -s v
complete -c dirmngr -l sh
complete -c dirmngr -s c
complete -c dirmngr -l csh -d 'Format the info output in daemon mode for use with the standard Bourne shell …'
complete -c dirmngr -l no-use-tor -d 'The option --use-tor switches Dirmngr and thus GnuPG into ``Tor mode\'\' to rou…'
complete -c dirmngr -l connect-timeout
complete -c dirmngr -l quick -d 'value is capped at the value of the regular connect timeout'
complete -c dirmngr -l query-swdb -d details
complete -c dirmngr -l disable-ipv4
complete -c dirmngr -l hkp-cacert -d 'Use the root certificates in file for verification of the TLS certificates us…'

