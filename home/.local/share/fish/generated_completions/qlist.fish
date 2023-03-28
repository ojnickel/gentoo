# qlist
# Autogenerated from man page /usr/share/man/man1/qlist.1.bz2
complete -c qlist -s I -l installed -d 'Instead of listing the contents of a package, just print the package name if …'
complete -c qlist -s k -l binpkgs -d 'Operate on binary packages instead of installed packges'
complete -c qlist -s t -l tree -d 'Used with -I to list packages available in the tree'
complete -c qlist -s S -l slots -d 'Display installed packages with slots (use twice for subslots)'
complete -c qlist -s R -l repo -d 'Display installed packages with repository the ebuild originated from'
complete -c qlist -s U -l umap -d 'List USE-flags enabled when the package was installed.   This flag implies -I'
complete -c qlist -s c -l columns -d 'Like -Iv, but package name and version are separated by a space for easy cons…'
complete -c qlist -s m -l masks -d 'Filter matches for packages that are masked via the profiles'
complete -c qlist -l showdebug -d 'Show /usr/lib/debug and /usr/src/debug files'
complete -c qlist -s e -l exact -d 'Exact match (only CAT/PN or PN without PV)'
complete -c qlist -s d -l dir -d 'Only show directories'
complete -c qlist -s o -l obj -d 'Only show objects'
complete -c qlist -s s -l sym -d 'Only show symlinks'
complete -c qlist -s F -l format -d 'Print matched atom using given format string'
complete -c qlist -l root -d 'Set the ROOT env var'
complete -c qlist -s v -l verbose -d 'When used with -I, print the package version next to name'
complete -c qlist -s q -l quiet -d 'Tighter output; suppress warnings'
complete -c qlist -s C -l nocolor -d 'Don\'t output color'
complete -c qlist -l color -d 'Force color in output'
complete -c qlist -s h -l help -d 'Print this help and exit'
complete -c qlist -s V -l version -d 'Print version and exit'
