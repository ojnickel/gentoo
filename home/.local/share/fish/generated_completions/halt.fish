# halt
# Autogenerated from man page /usr/share/man/man8/halt.8.bz2
complete -c halt -s n -d 'Don\'t sync before reboot or halt'
complete -c halt -s w -d 'Don\'t actually reboot or halt but only write the wtmp record (in the /var/log…'
complete -c halt -s d -d 'Don\'t write the wtmp record'
complete -c halt -s f -d 'Force halt or reboot, don\'t call shutdown(8)'
complete -c halt -s i -d 'Shut down all network interfaces just before halt or reboot'
complete -c halt -s h -d 'Put all hard drives on the system in stand-by mode just before halt or power-…'
complete -c halt -s p -d 'When halting the system, switch off the power'
complete -c halt -s k -d 'Try to reboot using kexec, if kernel supports it'

