# dwebp
# Autogenerated from man page /usr/share/man/man1/dwebp.1.bz2
complete -c dwebp -s h -d 'Print usage summary'
complete -c dwebp -o version -d 'Print the version number (as major. minor. revision) and exit'
complete -c dwebp -s o -d 'Specify the name of the output file (as PNG format by default)'
complete -c dwebp -o bmp -d 'Change the output format to uncompressed BMP'
complete -c dwebp -o tiff -d 'Change the output format to uncompressed TIFF'
complete -c dwebp -o pam -d 'Change the output format to PAM (retains alpha)'
complete -c dwebp -o ppm -d 'Change the output format to PPM (discards alpha)'
complete -c dwebp -o pgm -d 'Change the output format to PGM'
complete -c dwebp -o yuv -d 'Change the output format to raw YUV'
complete -c dwebp -o nofancy -d 'Don\'t use the fancy upscaler for YUV420'
complete -c dwebp -o nofilter -d 'Don\'t use the in-loop filtering process even if it is required by the bitstre…'
complete -c dwebp -o dither -d 'Specify a dithering strength between 0 and 100'
complete -c dwebp -o alpha_dither -d 'If the compressed file contains a transparency plane that was quantized durin…'
complete -c dwebp -o nodither -d 'Disable all dithering (default)'
complete -c dwebp -o mt -d 'Use multi-threading for decoding, if possible'
complete -c dwebp -o crop -d 'Crop the decoded picture to a rectangle with top-left corner at coordinates (…'
complete -c dwebp -o flip -d 'Flip decoded image vertically (can be useful for OpenGL textures for instance)'
complete -c dwebp -o resize -o scale -d 'Rescale the decoded picture to dimension width x height'
complete -c dwebp -o quiet -d 'Do not print anything'
complete -c dwebp -s v -d 'Print extra information (decoding time in particular)'
complete -c dwebp -o noasm -d 'Disable all assembly optimizations'

