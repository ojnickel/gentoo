# find
# Autogenerated from man page /usr/share/man/man1/find.1.bz2
complete -c find -s P -d 'Never follow symbolic links.   This is the default behaviour'
complete -c find -s L -d 'Follow symbolic links'
complete -c find -s H -d 'Do not follow symbolic links, except while processing the command line argume…'
complete -c find -s D -d 'Print diagnostic information; this can be helpful to diagnose problems with w…'
complete -c find -o Olevel -d 'Enables query optimisation'
complete -c find -o print -d 'is used (but you should probably consider using'
complete -c find -o print0 -d 'instead, anyway)'
complete -c find -s O -d 'must appear before the first path name, if at all.   A double dash'
complete -c find -o files0-from -d 'to pass arbitrary starting points to find '
complete -c find -o noleaf -d 'If you later use the'
complete -c find -o type -d 'predicate will always match against the type of the file that a symbolic link…'
complete -c find -o delete -d 'can give rise to confusing behaviour.  Using'
complete -c find -o lname -d and
complete -c find -o ilname -d 'predicates always to return false'
complete -c find -o maxdepth -d 'would prevent this)'
complete -c find -o newer -d 'will be dereferenced, and the timestamp will be taken from the file to which …'
complete -c find -o newerXY
complete -c find -o anewer -d and
complete -c find -o cnewer
complete -c find -o follow -d 'option has a similar effect to'
complete -c find -o name -d and
complete -c find -o regex -d 'are performed first.  2 Any'
complete -c find -o xtype -d 'tests are performed after any tests based only on the names of files, but bef…'
complete -c find -o fstype -d 'predicate and specify a filesystem type FOO which is not known (that is, pres…'
complete -c find -o false -d '3 At this optimisation level, the full cost-based query optimiser is enabled'
complete -c find -s o -d 'predicates which are likely to succeed are evaluated earlier, and for'
complete -c find -s a -d 'predicates which are likely to fail are evaluated earlier'
complete -c find -o empty -d 'test for example is true only when the current file is empty'
complete -c find -o depth -d 'option for example makes find traverse the file system in a depth-first order'
complete -c find -o regextype -d 'option for example is positional, specifying the regular expression dialect f…'
complete -c find -o prune -d or
complete -c find -o quit -d 'Actions which inhibit the default'
complete -c find -o exec
complete -c find -o execdir
complete -c find -o ok
complete -c find -o okdir
complete -c find -o fls
complete -c find -o fprint
complete -c find -o fprintf
complete -c find -o ls
complete -c find -o printf -d The
complete -c find -o daystart -d 'Measure times (for'
complete -c find -o amin
complete -c find -o atime
complete -c find -o cmin
complete -c find -o ctime
complete -c find -o mmin -d and
complete -c find -o mtime -d 'from the beginning of today rather than from 24 hours ago'
complete -c find -o iregex -d 'tests which occur later on the command line'
complete -c find -o warn -o nowarn -d 'Turn warning messages on or off'
complete -c find -s d -d 'A synonym for -depth, for compatibility with FreeBSD, NetBSD,  MacOS X and Op…'
complete -c find -o help -l help -d 'Print a summary of the command-line usage of find and exit'
complete -c find -o ignore_readdir_race -d 'Normally, find will emit an error message when it fails to stat a file'
complete -c find -o mindepth -d 'Do not apply any tests or actions at levels less than levels (a non-negative …'
complete -c find -o mount -d 'Don\'t descend directories on other filesystems.   An alternate name for'
complete -c find -o xdev -d 'for compatibility with some other versions of find '
complete -c find -o noignore_readdir_race -d 'Turns off the effect of'
complete -c find -o version -l version -d 'Print the find version number and exit'
complete -c find -o samefile -d 'allow comparison between the file currently being examined and some reference…'
complete -c find -o gid
complete -c find -o inum
complete -c find -o links
complete -c find -o size
complete -c find -o uid -d and
complete -c find -o used -d 'as +n for greater than n ,'
complete -c find -s n -d 'for less than n , n for exactly n .  Supported tests:'
complete -c find -o executable -d 'Matches files which are executable and directories which are searchable (in a…'
complete -c find -o perm -d 'test ignores'
complete -c find -o group -d 'File belongs to group gname (numeric group ID allowed)'
complete -c find -o iname -d Like
complete -c find -o ipath -d Like
complete -c find -o path -d 'but the match is case insensitive'
complete -c find -o iwholename -d 'See -ipath.   This alternative is less portable than'
complete -c find -o nogroup -d 'No group corresponds to file\'s numeric group ID'
complete -c find -o nouser -d 'No user corresponds to file\'s numeric user ID'
complete -c find -o mode -d 'All of the permission bits mode are set for the file'
complete -c find -o 000
complete -c find -o readable -d 'Matches files which are readable by the current user'
complete -c find -o 1M -d 'is not equivalent to'
complete -c find -o 1048576c -d 'The former only matches empty files, the latter matches files from 0 to 1,048…'
complete -c find -o true -d 'Always true'
complete -c find -o user -d 'File is owned by user uname (numeric user ID allowed)'
complete -c find -o wholename -d 'See -path.   This alternative is less portable than'
complete -c find -o writable -d 'Matches files which are writable by the current user'
complete -c find -o context -d '(SELinux only) Security context of the file matches glob pattern '
complete -c find -o fprint0 -d 'True; like'
complete -c find -s 0 -d 'option of xargs '
complete -c find -o not -d 'Same as ! expr , but not POSIX compliant'
complete -c find -o a+r -d 'have at least one write bit set ( -perm /222 or'
complete -c find -o or
complete -c find -o 'newerXY	4.3.3	BSD'
complete -c find -o 'D	4.3.1'
complete -c find -o 'O	4.3.1'
complete -c find -o 'readable	4.3.0'
complete -c find -o 'writable	4.3.0'
complete -c find -o 'executable	4.3.0'
complete -c find -o 'regextype	4.2.24'
complete -c find -o 'execdir	4.2.12	BSD'
complete -c find -o 'okdir	4.2.12'
complete -c find -o 'samefile	4.2.11'
complete -c find -o 'H	4.2.5	POSIX'
complete -c find -o 'L	4.2.5	POSIX'
complete -c find -o 'P	4.2.5	BSD'
complete -c find -o 'delete	4.2.3'
complete -c find -o 'quit	4.2.3'
complete -c find -o 'd	4.2.3	BSD'
complete -c find -o 'wholename	4.2.0'
complete -c find -o 'iwholename	4.2.0'
complete -c find -o 'ignore_readdir_race	4.2.0'
complete -c find -o 'fls	4.0'
complete -c find -o 'ilname	3.8'
complete -c find -o 'iname	3.8'
complete -c find -o 'ipath	3.8'
complete -c find -o 'iregex	3.8' -d 'The syntax . B -perm +MODE was removed in findutils-4. 5. 12, in favour of '

