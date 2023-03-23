# busctl
# Autogenerated from man page /usr/share/man/man1/busctl.1.bz2
complete -c busctl -l address -d 'Connect to the bus specified by ADDRESS instead of using suitable defaults fo…'
complete -c busctl -l show-machine -d 'When showing the list of peers, show a column containing the names of contain…'
complete -c busctl -l unique -d 'When showing the list of peers, show only "unique" names (of the form ":number'
complete -c busctl -l acquired -d 'The opposite of --unique \\(em only "well-known" names will be shown'
complete -c busctl -l activatable -d 'When showing the list of peers, show only peers which have actually not been …'
complete -c busctl -l match -d 'When showing messages being exchanged, show only the subset matching MATCH'
complete -c busctl -l size -d 'When used with the capture command, specifies the maximum bus message size to…'
complete -c busctl -l list -d 'When used with the tree command, shows a flat list of object paths instead of…'
complete -c busctl -s q -l quiet -d 'When used with the call command, suppresses display of the response message p…'
complete -c busctl -l verbose -d 'When used with the call or get-property command, shows output in a more verbo…'
complete -c busctl -l xml-interface -d 'When used with the introspect call, dump the XML description received from th…'
complete -c busctl -l json -d 'When used with the call or get-property command, shows output formatted as JS…'
complete -c busctl -s j -d 'Equivalent to --json=pretty when invoked interactively from a terminal'
complete -c busctl -l expect-reply -d 'When used with the call command, specifies whether busctl shall wait for comp…'
complete -c busctl -l auto-start -d 'When used with the call or emit command, specifies whether the method call sh…'
complete -c busctl -l allow-interactive-authorization -d 'When used with the call command, specifies whether the services may enforce i…'
complete -c busctl -l timeout -d 'When used with the call command, specifies the maximum time to wait for metho…'
complete -c busctl -l augment-creds -d 'Controls whether credential data reported by list or status shall be augmente…'
complete -c busctl -l watch-bind -d 'Controls whether to wait for the specified AF_UNIX bus socket to appear in th…'
complete -c busctl -l destination -d 'Takes a service name'
complete -c busctl -l user -d 'Talk to the service manager of the calling user, rather than the service mana…'
complete -c busctl -l system -d 'Talk to the service manager of the system.  This is the implied default'
complete -c busctl -s H -l host -d 'Execute the operation remotely'
complete -c busctl -s M -l machine -d 'Execute operation on a local container'
complete -c busctl -s l -l full -d 'Do not ellipsize the output in list command'
complete -c busctl -l no-pager -d 'Do not pipe output into a pager'
complete -c busctl -l no-legend -d 'Do not print the legend, i. e.  column headers and the footer with hints'
complete -c busctl -s h -l help -d 'Print a short help text and exit'
complete -c busctl -l version -d 'Print a short version string and exit'

