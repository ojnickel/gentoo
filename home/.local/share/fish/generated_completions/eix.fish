# eix
# Autogenerated from man page /usr/share/man/man1/eix.1.bz2
complete -c eix -s h -l help -d 'Print a help screen and exit'
complete -c eix -s Q -l quick -d 'Do (not) read the slots of installed versions which cannot be guessed (i. e'
complete -c eix -l care -d 'This deactivates --quick, and moreover, slots of installed version are always…'
complete -c eix -l deps-installed -d 'This is the same as DEPS_INSTALLED=true'
complete -c eix -s q -l quiet -d 'Produce no output on stdout'
complete -c eix -l dump -d 'Show the current eixrc-variables, and their defaults as comments; then exit'
complete -c eix -l dump-defaults -d 'Show the defaults of the eixrc-variables, and their current values as comment…'
complete -c eix -l print -d 'Print the specified variable VAR of eixrc or of portage settings, completely …'
complete -c eix -l known-vars -d 'Print an alphabetical list of variables known to eix with --print'
complete -c eix -s V -l version -d 'Print version and exit'
complete -c eix -s n -l nocolor -d 'Disables the use of ANSI color codes'
complete -c eix -s F -l force-color -d 'The opposite of --nocolor. \\"}}  . \\" {{-------- eix exclusive '
complete -c eix -l color -d 'Override all other color options and variables: Colorize always, never, or on…'
complete -c eix -l ansi -d 'Define the 256 color palette suggested by Todd Larason (the author of the 256…'
complete -c eix -l 256 -l 256d -l 256d0 -l 256d1 -l 256l -l 256l0 -l 256l1 -d 'Print the 256 color palettes (assuming it follows ansi color scheme) and exit'
complete -c eix -l print-all-eapis -d 'print all EAPIs used in some version'
complete -c eix -l print-all-useflags -d 'print all IUSE or REQUIRED_USE words used in some version'
complete -c eix -l print-all-keywords -d 'print all KEYWORDS used in some version'
complete -c eix -l print-all-slots -d 'print all SLOT strings used in some version'
complete -c eix -l print-all-licenses -d 'print all LICENSE strings used in some package'
complete -c eix -l print-all-depends -d 'print all words occurring in some {,R,P,B}DEPEND'
complete -c eix -l print-world-sets -d 'print the world sets'
complete -c eix -l print-profile-paths -d 'Outputs all paths of the current profile'
complete -c eix -l nowarn -d 'Suppress some warnings concerning the portage configuration'
complete -c eix -s x -l versionsort -d 'Prints available versions sorted by versions (slots)'
complete -c eix -s l -l versionlines -d 'Prints available versions in a (vertical) list'
complete -c eix -s c -l compact -d 'Causes eix to use a compact layout for search results'
complete -c eix -s v -l verbose -d 'Use a verbose layout with additional information about search results such as…'
complete -c eix -s N -l normal -d 'Use the normal layout which is the default if DEFAULT_FORMAT was not explicit…'
complete -c eix -l xml -l proto -d 'Output in XML or protobuf format'
complete -c eix -s '*' -l pure-packages -d '(do not forget quoting if you use the short form from within a shell'
complete -c eix -s '#' -l only-names -d 'As --pure-packages, but additionally print only the category and name of the …'
complete -c eix -s 0 -l brief -d 'Print at most one package then stop'
complete -c eix -l brief2 -d 'As --brief, but print up to two packages. \\"}}  '
complete -c eix -s t -l test-non-matching -d 'Before other output, print entries of /etc/portage/package'
complete -c eix -s R -l remote -d 'Uses the value of EIX_REMOTE1 as cache file name'
complete -c eix -s Z -l remote2 -d 'Uses the value of EIX_REMOTE2 as cache file name'
complete -c eix -l cache-file -d 'Use FILE instead of /var/cache/eix/portage. eix'
complete -c eix -s I -l installed -d 'Only match installed packages'
complete -c eix -s i -l multi-installed -d 'Only match packages which are installed in at least two different versions'
complete -c eix -s d -l dup-packages -d 'Only match duplicated packages, for example, if sys-foo/bar exists both in th…'
complete -c eix -s D -l dup-versions -d 'Only match packages with duplicated versions, for example, if sys-foo/bar-0'
complete -c eix -s 1 -l slotted -d 'Only match packages with a nontrivial slot, i. e'
complete -c eix -s 2 -l slots -d 'Only match packages with at least two different slots'
complete -c eix -s u -l upgrade -l upgrade+ -l upgrade- -d 'Only match packages which have at least one slotted version installed which i…'
complete -c eix -l stable -l testing -l non-masked -l system -l profile -d 'Only match packages which have at least one version which is stable (and non-…'
complete -c eix -l stable+ -l testing+ -l non-masked+ -l system+ -l profile+ -d 'This is as the above ones just that the test acts as if LOCAL_PORTAGE_CONFIG=…'
complete -c eix -l stable- -l testing- -l non-masked- -l system- -l profile- -d 'This is as the above ones just that the test acts as if LOCAL_PORTAGE_CONFIG=…'
complete -c eix -l installed-unstable -l installed-testing -l installed-masked -d 'Only match packages which have at least one non-stable, testing, or masked ve…'
complete -c eix -l world -d 'Only match @world packages.  This is analogous to "emerge @world", i. e'
complete -c eix -l world-file -d 'This only matches packages from the world file or from the @system set'
complete -c eix -l world-set -d 'This only matches packages from world_set or from the @system set'
complete -c eix -l selected -d 'Only match @selected packages.  This is analogous to "emerge @selected", i. e'
complete -c eix -l selected-file -d 'This only matches packages from the world file'
complete -c eix -l selected-set -d 'This only matches packages from world_set'
complete -c eix -l binary -d 'Only match packages with a binary file (*. tbz2 or *. xpak) in PKGDIR'
complete -c eix -l nonvirtual -d 'Only match packages with at least one version from the main tree or a non-vir…'
complete -c eix -l virtual -d 'Only match packages with at least one version in a virtual overlay'
complete -c eix -s O -l overlay -d 'Only match packages with at least one version in an overlay'
complete -c eix -l in-overlay -d 'Only match packages with at least one version in an overlay matching overlay'
complete -c eix -l only-in-overlay -d 'Only match packages which have only versions in an overlay matching overlay'
complete -c eix -s J -l installed-overlay -d 'Only match packages which have been installed from some overlay'
complete -c eix -l installed-from-overlay -d 'This is analogous to --in-overlay with the difference that only packages are …'
complete -c eix -l installed-in-some-overlay -d 'Only match packages with at least one installed version number which is also …'
complete -c eix -l installed-in-overlay -d 'This is analogous to --in-overlay with the difference that only packages are …'
complete -c eix -l restrict-fetch -d 'Only match packages which have at least one version with RESTRICT=fetch'
complete -c eix -l restrict-mirror -d 'Only match packages which have at least one version with RESTRICT=mirror'
complete -c eix -l restrict-primaryuri -d 'Only match packages which have at least one version with RESTRICT=primaryuri'
complete -c eix -l restrict-binchecks -d 'Only match packages which have at least one version with RESTRICT=binchecks'
complete -c eix -l restrict-strip -d 'Only match packages which have at least one version with RESTRICT=strip'
complete -c eix -l restrict-test -d 'Only match packages which have at least one version with RESTRICT=test'
complete -c eix -l restrict-userpriv -d 'Only match packages which have at least one version with RESTRICT=userpriv'
complete -c eix -l restrict-installsources -d 'Only match packages which have at least one version with RESTRICT=installsour…'
complete -c eix -l restrict-bindist -d 'Only match packages which have at least one version with RESTRICT=bindist'
complete -c eix -l restrict-parallel -d 'Only match packages which have at least one version with RESTRICT=parallel'
complete -c eix -l properties-interactive -d 'Only match packages which have at least one version with PROPERTIES=interacti…'
complete -c eix -l properties-live -d 'Only match packages which have at least one version with PROPERTIES=live'
complete -c eix -l properties-virtual -d 'Only match packages which have at least one version with PROPERTIES=virtual'
complete -c eix -l properties-set -d 'Only match packages which have at least one version with PROPERTIES=set'
complete -c eix -s T -l test-obsolete -d 'Only match obsolete packages'
complete -c eix -l pipe -d '(Recall that a shell will not pass an unquoted | sign, so quote properly)'
complete -c eix -l pipe-mask -d 'This is analogous to --pipe with the difference that only masks are allowed i…'
complete -c eix -s y -l any -d 'Any match field is searched'
complete -c eix -s s -l name -d 'e. g.  "eix"'
complete -c eix -s S -l description -d 'e. g.  "Small utility for searching . "'
complete -c eix -s C -l category -d 'e. g.  "app-portage"'
complete -c eix -s A -l category-name -d 'e. g.  "app-portage/eix"'
complete -c eix -s H -l homepage -d 'e. g.  "https://github. com/vaeth/eix/"'
complete -c eix -s L -l license -d 'e. g.  "GPL-2"'
complete -c eix -l available-deps -l available-depend -l available-rdepend -l available-pdepend -l available-bdepend -l available-idepend -d 'This test can only be successful if DEP=true is used (and if DEP=true was use…'
complete -c eix -l installed-deps -l installed-depend -l installed-rdepend -l installed-pdepend -l installed-bdepend -l installed-idepend -d 'This is similar to the corresponding option --available-* but with the differ…'
complete -c eix -l deps -l depend -l rdepend -l pdepend -l bdepend -l idepend -d 'These are shortcuts for specifying the corresponding --available-* and --inst…'
complete -c eix -l set -d 'Name of a local package set of a version in the database (i. e'
complete -c eix -l src-uri -d 'SRC_URI of a version in the database'
complete -c eix -l eapi -d 'EAPI of a version in the database, e. g.  "6"'
complete -c eix -l installed-eapi -d 'EAPI of an installed version'
complete -c eix -l slot -d 'Slotname of a version in the database, e. g.  "kde-4"'
complete -c eix -l fullslot -d 'Slotname of a version in the database, possibly with its subslot, e. g.  "3/1'
complete -c eix -l installed-slot -d 'Slotname of an installed version'
complete -c eix -l installed-fullslot -d 'Slotname of an installed version, possibly with its subslot'
complete -c eix -s U -l use -d 'A useflag defined by IUSE in some version by some of the ebuilds of the packa…'
complete -c eix -l installed-with-use -d 'A useflag enabled during installation of the package'
complete -c eix -l installed-without-use -d 'A useflag disabled during installation of the package'
complete -c eix -s e -l exact -d 'Pattern is an exact (full) string'
complete -c eix -s b -l begin -d 'Pattern is the beginning of the string'
complete -c eix -l end -d 'Pattern is the end of the string'
complete -c eix -s z -l substring -d 'Pattern occurs somewhere within the string'
complete -c eix -s f -l fuzzy -d 'Do a fuzzy search with a maximal levenshtein-distance of N (default ) for the…'
complete -c eix -s p -l pattern -d 'pattern is a wildcard-pattern (for the full string)'
complete -c eix -s r -l regex -d 'pattern is a regexp'
complete -c eix -l format -d 'Defines the FORMATSTRING.  Since eix-0. 29'
complete -c eix -l nostatus -d 'Do not update the status line'
complete -c eix -l force-status -d 'Update the status line even if output is not a terminal or if TERM does not b…'
complete -c eix -s o -l output -d 'With this option, eix-update will write the eix database to outputfile instea…'
complete -c eix -s a -l add-overlay -d 'This is similar to adding overlay to PORTDIR_OVERLAY in /etc/portage/make'
complete -c eix -l exclude-overlay -d 'This is similar to adding overlay to EXCLUDE_OVERLAY but has the advantage th…'
complete -c eix -s m -l override-method -d 'Change the cache method of overlay (the PORTDIR directory is an allowed overl…'
complete -c eix -l repo-name -d 'The overlay overlay-path obtains the label overlay-label, independent of any …'
