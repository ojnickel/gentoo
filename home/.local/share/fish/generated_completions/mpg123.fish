# mpg123
# Autogenerated from man page /usr/share/man/man1/mpg123.1.bz2
complete -c mpg123 -s k -l skip -d 'Skip first num frames.   By default the decoding starts at the first frame'
complete -c mpg123 -s n -l frames -d 'Decode only num frames.   By default the complete stream is decoded'
complete -c mpg123 -l fuzzy -d 'Enable fuzzy seeks (guessing byte offsets or using approximate seek points fr…'
complete -c mpg123 -s y -l no-resync -d 'Do NOT try to resync and continue decoding if an error occurs in the input fi…'
complete -c mpg123 -s F -l no-frankenstein -d 'Disable support for Frankenstein streams'
complete -c mpg123 -l resync-limit -d 'Set number of bytes to search for valid MPEG data once lost in stream; <0 mea…'
complete -c mpg123 -s p -l proxy -d 'The specified proxy will be used for HTTP requests'
complete -c mpg123 -s u -l auth -d 'HTTP authentication to use when receiving files via HTTP'
complete -c mpg123 -l ignore-mime -d 'Ignore MIME types given by HTTP server'
complete -c mpg123 -l no-icy-meta -d 'Do not accept ICY meta data'
complete -c mpg123 -l streamdump -d 'Dump a copy of the input data (as read by libmpg123) to the given file'
complete -c mpg123 -l icy-interval -d 'This setting enables you to play a stream dump containing ICY metadata at the…'
complete -c mpg123 -l no-seekbuffer -d 'Disable the default micro-buffering of non-seekable streams that gives the pa…'
complete -c mpg123 -s @ -l list -d 'Read filenames and/or URLs of MPEG audio streams from the specified file in a…'
complete -c mpg123 -s l -l listentry -d 'Of the playlist, play specified entry only'
complete -c mpg123 -l continue -d 'Enable playlist continuation mode'
complete -c mpg123 -l loop -d 'for looping track(s) a certain number of times, < 0 means infinite loop (not …'
complete -c mpg123 -l keep-open -d 'For remote control mode: Keep loaded file open after reaching end'
complete -c mpg123 -l timeout -d 'Timeout in (integer) seconds before declaring a stream dead (if <= 0, wait fo…'
complete -c mpg123 -s z -l shuffle -d 'Shuffle play'
complete -c mpg123 -s Z -l random -d 'Continuous random play'
complete -c mpg123 -s i -l index -d 'Index / scan through the track before playback'
complete -c mpg123 -l index-size -d 'Set the number of entries in the seek frame index table'
complete -c mpg123 -l preframes -d 'Set the number of frames to be read as lead-in before a seeked-to position'
complete -c mpg123 -s o -l output -d 'Select audio output module'
complete -c mpg123 -l list-modules -d 'List the available modules'
complete -c mpg123 -l list-devices -d 'List the available output devices for given output module'
complete -c mpg123 -s a -l audiodevice -d 'Specify the audio device to use'
complete -c mpg123 -s s -l stdout -d 'The decoded audio samples are written to standard output, instead of playing …'
complete -c mpg123 -s O -l outfile -d 'Write raw output into a file (instead of simply redirecting standard output t…'
complete -c mpg123 -s w -l wav -d 'Write output as WAV file'
complete -c mpg123 -l au -d and
complete -c mpg123 -l cdr -d 'for AU and CDR format, respectively'
complete -c mpg123 -l reopen -d 'Forces reopen of the audiodevice after ever song'
complete -c mpg123 -l cpu -d 'Selects a certain decoder (optimized for specific CPU), for example i586 or M…'
complete -c mpg123 -l test-cpu -d 'Tests your CPU and prints a list of possible choices for --cpu'
complete -c mpg123 -l list-cpu -d 'Lists all available decoder choices, regardless of support by your CPU'
complete -c mpg123 -s g -l gain -d '[DEPRECATED] Set audio hardware output gain (default: don\'t change)'
complete -c mpg123 -s f -l scale -d 'Change scale factor (default: 32768)'
complete -c mpg123 -l rva-mix -l rva-radio -d 'Enable RVA (relative volume adjustment) using the values stored for ReplayGai…'
complete -c mpg123 -l rva-album -l rva-audiophile -d 'Enable RVA (relative volume adjustment) using the values stored for ReplayGai…'
complete -c mpg123 -s 0 -l single0 -s 1 -l single1 -d 'Decode only channel 0 (left) or channel 1 (right), respectively'
complete -c mpg123 -s m -l mono -l mix -l singlemix -d 'Mix both channels / decode mono'
complete -c mpg123 -l stereo -d 'Force stereo output'
complete -c mpg123 -s r -l rate -d 'Set sample rate (default: automatic)'
complete -c mpg123 -l resample -d 'Set resampling method to employ if forcing an output rate'
complete -c mpg123 -s 2 -l 2to1 -s 4 -l 4to1 -d 'Performs a downsampling of ratio 2:1 (22 kHz from 44'
complete -c mpg123 -l pitch -d 'Set a pitch change (speedup/down, 0 is neutral; 0. 05 is 5% speedup)'
complete -c mpg123 -l 8bit -d 'Forces 8bit output'
complete -c mpg123 -l float -d 'Forces f32 encoding'
complete -c mpg123 -s e -l encoding -d 'Choose output sample encoding'
complete -c mpg123 -s d -l doublespeed -d 'Only play every n \'th frame'
complete -c mpg123 -l halfspeed -d 'option to play 3 out of 4 frames etc'
complete -c mpg123 -s h -d 'Play each frame n times'
complete -c mpg123 -s E -l equalizer -d 'Enables equalization, taken from file '
complete -c mpg123 -l gapless -d 'Enable code that cuts (junk) samples at beginning and end of tracks, enabling…'
complete -c mpg123 -l no-gapless -d 'Disable the gapless code'
complete -c mpg123 -l no-infoframe -d 'Do not parse the Xing/Lame/VBR/Info frame, decode it instead just like a stup…'
complete -c mpg123 -s D -l delay -d 'Insert a delay of n seconds before each track'
complete -c mpg123 -l headphones -d 'Direct audio output to the headphone connector (some hardware only; AIX, HP, …'
complete -c mpg123 -l speaker -d 'Direct audio output to the speaker  (some hardware only; AIX, HP, SUN)'
complete -c mpg123 -l lineout -d 'Direct audio output to the line-out connector (some hardware only; AIX, HP, S…'
complete -c mpg123 -s b -l buffer -d 'Use an audio output buffer of size Kbytes'
complete -c mpg123 -l preload -d 'Wait for the buffer to be filled to fraction before starting playback (fracti…'
complete -c mpg123 -l devbuffer -d 'Set device buffer in seconds; <= 0 means default value'
complete -c mpg123 -l smooth -d 'Keep buffer over track boundaries -- meaning, do not empty the buffer between…'
complete -c mpg123 -s t -l test -d 'Test mode.   The audio stream is decoded, but no output occurs'
complete -c mpg123 -s c -l check -d 'Check for filter range violations (clipping), and report them for each frame …'
complete -c mpg123 -s v -l verbose -d 'Increase the verbosity level'
complete -c mpg123 -s q -l quiet -d 'Quiet.   Suppress diagnostic messages'
complete -c mpg123 -s C -l control -d 'Enable terminal control keys'
complete -c mpg123 -l no-control -d 'Disable terminal control even if terminal is detected'
complete -c mpg123 -l title -d 'In an xterm, rxvt, screen, iris-ansi (compatible, TERM environment variable i…'
complete -c mpg123 -l name -d 'Set the name of this instance, possibly used in various places'
complete -c mpg123 -l long-tag -d 'Display ID3 tag info always in long format with one line per item (artist, ti…'
complete -c mpg123 -l utf8 -d 'Regardless of environment, print metadata in UTF-8 (otherwise, when not using…'
complete -c mpg123 -s R -l remote -d 'Activate generic control interface'
complete -c mpg123 -l remote-err -d 'Print responses for generic control mode to standard error, not standard out'
complete -c mpg123 -l fifo -d 'Create a fifo / named pipe on the given path and use that for reading command…'
complete -c mpg123 -l aggressive -d 'Tries to get higher priority'
complete -c mpg123 -s T -l realtime -d 'Tries to gain realtime priority'
complete -c mpg123 -s '?' -l help -d 'Shows short usage instructions'
complete -c mpg123 -l longhelp -d 'Shows long usage instructions'
complete -c mpg123 -l version -d 'Print the version string'

