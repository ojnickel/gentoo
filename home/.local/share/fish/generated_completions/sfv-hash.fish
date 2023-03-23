# sfv-hash
# Autogenerated from man page /usr/share/man/man1/sfv-hash.1.bz2
complete -c sfv-hash -l printf -l template -d 'To output all sums use the `-a\' option'
complete -c sfv-hash -s c -l check -d 'Check hash files specified by command line'
complete -c sfv-hash -s u -l update -d 'Update the hash file specified by the option'
complete -c sfv-hash -s k -l check-embedded -d 'Verify files by crc32 sum embedded in their names'
complete -c sfv-hash -l torrent -d 'Create a torrent file for each processed file'
complete -c sfv-hash -s h -l help -d 'Help: print help screen and exit'
complete -c sfv-hash -s V -l version -d 'Version: print version and exit'
complete -c sfv-hash -s B -l benchmark -d 'Run benchmark for the selected hash algorithm(s)'
complete -c sfv-hash -s C -l crc32 -d 'CRC32: Select CRC32 checksum algorithm'
complete -c sfv-hash -l crc32c -d 'CRC32C: Select CRC32C checksum algorithm'
complete -c sfv-hash -l md4 -d 'MD4: Select MD4 hash function'
complete -c sfv-hash -s M -l md5 -d 'MD5: Select MD5 hash function'
complete -c sfv-hash -s H -l sha1 -d 'SHA1: Select SHA1 hash function'
complete -c sfv-hash -l sha224 -l sha256 -l sha384 -l sha512 -d 'Select specified SHA2 hash function'
complete -c sfv-hash -l sha3-224 -l sha3-256 -l sha3-384 -l sha3-512 -d 'Select specified SHA3 hash function'
complete -c sfv-hash -l tiger -d 'Tiger: Select Tiger hash function'
complete -c sfv-hash -s T -l tth -d 'TTH: Select DC++ TTH hash function'
complete -c sfv-hash -l btih -d 'BTIH: Select BitTorrent Info Hash'
complete -c sfv-hash -s A -l aich -d 'AICH: Select AICH hash function'
complete -c sfv-hash -s E -l ed2k -d 'ED2K: Select eDonkey 2000 hash function'
complete -c sfv-hash -s L -l ed2k-link -d 'eDonkey link: calculate and print eDonkey link'
complete -c sfv-hash -s W -l whirlpool -d 'Whirlpool: Select Whirlpool hash function'
complete -c sfv-hash -s G -l gost12-256 -d 'GOST-2012: Select 256-bit GOST R 34'
complete -c sfv-hash -l gost12-512 -d 'GOST-2012: Select 512-bit GOST R 34'
complete -c sfv-hash -l gost94 -d 'GOST-94: Select GOST R 34. 11-94, the deprecated Russian hash function'
complete -c sfv-hash -l gost94-cryptopro -d 'GOST-94-CRYPTOPRO: Select the CryptoPro version of the deprecated Russian GOS…'
complete -c sfv-hash -l ripemd160 -d 'RIPEMD-160: Select RIPEMD-160 hash function'
complete -c sfv-hash -l has160 -d 'HAS-160: Select HAS-160 hash function'
complete -c sfv-hash -l snefru128 -l snefru256 -d 'SNEFRU: Select SNEFRU-128/256 hash function'
complete -c sfv-hash -l edonr256 -l edonr512 -d 'EDON-R: Select EDON-R 256/512 hash function'
complete -c sfv-hash -l blake2b -l blake2s -d 'BLAKE2: Select BLAKE2b/BLAKE2s hash function'
complete -c sfv-hash -s a -l all -d 'Calculate all supported hash functions'
complete -c sfv-hash -l list-hashes -d 'List names of all supported hash functions, one per line'
complete -c sfv-hash -s r -l recursive -d 'Recursively process directories, specified by command line'
complete -c sfv-hash -l file-list -d 'Process given file as a file-list'
complete -c sfv-hash -s m -l message -d 'Calculate message digests of the given text message'
complete -c sfv-hash -l follow -d 'Follow symbolic links when processing files or directories recursively'
complete -c sfv-hash -s v -l verbose -d 'Be verbose'
complete -c sfv-hash -s P -l percents -d 'Show percents, while calculating or checking sums'
complete -c sfv-hash -l skip-ok -d 'Don\'t print OK messages for successfully verified files'
complete -c sfv-hash -s i -l ignore-case -d 'Ignore case of filenames when updating crc files'
complete -c sfv-hash -l speed -d 'Print per-file and the total processing speed'
complete -c sfv-hash -s e -l embed-crc -d 'Rename files by inserting crc32 sum into name'
complete -c sfv-hash -l embed-crc-delimiter -d 'Insert specified <delimiter> before a crc sum in the --embed-crc mode, defaul…'
complete -c sfv-hash -l path-separator -d 'Use specified path separator to display paths'
complete -c sfv-hash -s q -l accept -d 'Set a comma-delimited list of extensions of the files to process'
complete -c sfv-hash -l exclude -d 'Set a comma-delimited list of extensions of the files to exclude from process…'
complete -c sfv-hash -s t -l crc-accept -d 'Set a comma-delimited list of extensions of the hash files to verify'
complete -c sfv-hash -l maxdepth -d 'Descend at most <levels> (a non-negative integer) levels of directories below…'
complete -c sfv-hash -s o -l output -d 'Set the file to output calculated message digests or verification results to'
complete -c sfv-hash -s l -l log -d 'Set the file to log errors and verbose information to'
complete -c sfv-hash -l openssl -d 'Specify which hash functions should be calculated using the OpenSSL library'
complete -c sfv-hash -l gost-reverse -d 'Reverse bytes in hexadecimal output of a GOST hash functions'
complete -c sfv-hash -l bt-batch -d 'Turn on torrent batch mode (implies torrent mode)'
complete -c sfv-hash -l bt-private -d 'Generate BTIH for a private BitTorrent tracker'
complete -c sfv-hash -l bt-piece-length -d 'Set the piece length value for torrent file'
complete -c sfv-hash -l bt-announce -d 'Add a tracker announce URL to the created torrent file(s)'
complete -c sfv-hash -l benchmark-raw -d 'Switch benchmark output format to be a machine-readable tab-delimited text wi…'
complete -c sfv-hash -l no-detect-by-ext -d 'Disable hash function detection from a hash file extension in the --check mode'
complete -c sfv-hash -l sfv -d 'Print message digests in the SFV (Simple File Verification) output format (de…'
complete -c sfv-hash -s g -l magnet -d 'Print message digests formatted as magnet links'
complete -c sfv-hash -l bsd -d 'Use BSD output format'
complete -c sfv-hash -l simple -d 'Use simple output format'
complete -c sfv-hash -l hex -d 'Print message digests in hexadecimal format'
complete -c sfv-hash -l base32 -d 'Print message digests in Base32 format'
complete -c sfv-hash -l base64 -d 'Print message digests in Base64 format'
complete -c sfv-hash -l uppercase -d 'Print message digests in upper case'
complete -c sfv-hash -l lowercase -d 'Print message digests in lower case'
complete -c sfv-hash -s p -d 'Format: print format string the standard output, interpreting `\' escapes and …'

