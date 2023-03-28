# git-instaweb
# Autogenerated from man page /usr/share/man/man1/git-instaweb.1.bz2
complete -c git-instaweb -s l -l local -d 'Only bind the web server to the local IP (127. 0. 0. 1)'
complete -c git-instaweb -s d -l httpd -d 'The HTTP daemon command-line that will be executed'
complete -c git-instaweb -s m -l module-path -d 'The module path (only needed if httpd is Apache)'
complete -c git-instaweb -s p -l port -d 'The port number to bind the httpd to.  (Default: 1234)'
complete -c git-instaweb -s b -l browser -d 'The web browser that should be used to view the gitweb page'
complete -c git-instaweb -l start -d 'Start the httpd instance and exit'
complete -c git-instaweb -l stop -d 'Stop the httpd instance and exit'
complete -c git-instaweb -l restart -d 'Restart the httpd instance and exit'
