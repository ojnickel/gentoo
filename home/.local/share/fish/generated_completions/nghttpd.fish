# nghttpd
# Autogenerated from man page /usr/share/man/man1/nghttpd.1.bz2
complete -c nghttpd -s a -l address -d 'The address to bind to'
complete -c nghttpd -s D -l daemon -d 'Run in a background'
complete -c nghttpd -s V -l verify-client -d 'The server  sends a client certificate  request'
complete -c nghttpd -s d -l htdocs -d 'Specify document root'
complete -c nghttpd -s v -l verbose -d 'Print debug information  such as reception/ transmission of frames and name/v…'
complete -c nghttpd -l no-tls -d 'Disable SSL/TLS'
complete -c nghttpd -s c -l header-table-size -d 'Specify decoder header table size'
complete -c nghttpd -l encoder-header-table-size -d 'Specify encoder header table size'
complete -c nghttpd -l color -d 'Force colored log output'
complete -c nghttpd -s p -l push -d 'Push  resources <PUSH_PATH>s  when <PATH>  is requested'
complete -c nghttpd -s b -l padding -d 'Add at  most <N>  bytes to a  frame payload  as padding'
complete -c nghttpd -s m -l max-concurrent-streams -d 'Set the maximum number of  the concurrent streams in one HTTP/2 session'
complete -c nghttpd -s n -l workers -d 'Set the number of worker threads. sp Default: 1'
complete -c nghttpd -s e -l error-gzip -d 'Make error response gzipped'
complete -c nghttpd -s w -l window-bits -d 'Sets the stream level initial window size to 2**<N>-1'
complete -c nghttpd -s W -l connection-window-bits -d 'Sets  the  connection  level   initial  window  size  to 2**<N>-1'
complete -c nghttpd -l dh-param-file -d 'Path to file that contains  DH parameters in PEM format'
complete -c nghttpd -l early-response -d 'Start sending response when request HEADERS is received, rather than complete…'
complete -c nghttpd -l trailer -d 'Add a trailer  header to a response'
complete -c nghttpd -l hexdump -d 'Display the  incoming traffic in  hexadecimal (Canonical hex+ASCII display)'
complete -c nghttpd -l echo-upload -d 'Send back uploaded content if method is POST or PUT'
complete -c nghttpd -l mime-types-file -d 'Path  to file  that contains  MIME media  types and  the extensions that repr…'
complete -c nghttpd -l no-content-length -d 'Don\\(aqt send content-length header field'
complete -c nghttpd -l version -d 'Display version information and exit'
complete -c nghttpd -s h -l help -d 'Display this help and exit'

