# nghttp
# Autogenerated from man page /usr/share/man/man1/nghttp.1.bz2
complete -c nghttp -s v -l verbose -d 'Print   debug   information   such  as   reception   and transmission of fram…'
complete -c nghttp -s n -l null-out -d 'Discard downloaded data'
complete -c nghttp -s O -l remote-name -d 'Save  download  data  in  the  current  directory'
complete -c nghttp -s t -l timeout -d 'Timeout each request after <DURATION>.   Set 0 to disable timeout'
complete -c nghttp -s w -l window-bits -d 'Sets the stream level initial window size to 2**<N>-1'
complete -c nghttp -s W -l connection-window-bits -d 'Sets  the  connection  level   initial  window  size  to 2**<N>-1'
complete -c nghttp -s a -l get-assets -d 'Download assets  such as stylesheets, images  and script files linked  from t…'
complete -c nghttp -s s -l stat -d 'Print statistics'
complete -c nghttp -s H -l header -d 'Add a header to the requests.   Example: \\%-H\\(aq:method: PUT\\(aq'
complete -c nghttp -l trailer -d 'Add a trailer header to the requests'
complete -c nghttp -l cert -d 'Use  the specified  client certificate  file'
complete -c nghttp -l key -d 'Use the  client private key  file.   The file must  be in PEM format'
complete -c nghttp -s d -l data -d 'Post FILE to server.  If \\(aq-\\(aq  is given, data will be read from stdin'
complete -c nghttp -s m -l multiply -d 'Request each URI <N> times.   By default, same URI is not requested twice'
complete -c nghttp -s u -l upgrade -d 'Perform HTTP Upgrade for HTTP/2'
complete -c nghttp -s p -l weight -d 'Sets  weight of  given  URI'
complete -c nghttp -s M -l peer-max-concurrent-streams -d 'Use  <N>  as  SETTINGS_MAX_CONCURRENT_STREAMS  value  of remote endpoint as i…'
complete -c nghttp -s c -l header-table-size -d 'Specify decoder  header table  size'
complete -c nghttp -l encoder-header-table-size -d 'Specify encoder header table size'
complete -c nghttp -s b -l padding -d 'Add at  most <N>  bytes to a  frame payload  as padding'
complete -c nghttp -s r -l har -d 'Output HTTP  transactions <PATH> in HAR  format'
complete -c nghttp -l color -d 'Force colored log output'
complete -c nghttp -l continuation -d 'Send large header to test CONTINUATION'
complete -c nghttp -l no-content-length -d 'Don\\(aqt send content-length header field'
complete -c nghttp -l no-dep -d 'Don\\(aqt send dependency based priority hint to server'
complete -c nghttp -l hexdump -d 'Display the  incoming traffic in  hexadecimal (Canonical hex+ASCII display)'
complete -c nghttp -l no-push -d 'Disable server push'
complete -c nghttp -l max-concurrent-streams -d 'The  number of  concurrent  pushed  streams this  client accepts'
complete -c nghttp -l expect-continue -d 'Perform an Expect/Continue handshake:  wait to send DATA (up to  a short  tim…'
complete -c nghttp -s y -l no-verify-peer -d 'Suppress  warning  on  server  certificate  verification failure'
complete -c nghttp -l version -d 'Display version information and exit'
complete -c nghttp -s h -l help -d 'Display this help and exit'

