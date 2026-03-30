#!/bin/bash
# If you have Python 3 installed, run this to generate PNG icons from the SVG.
# Otherwise, open generate-icons.html in a browser and click the download links.

# Using sips (macOS built-in) to convert if rsvg-convert isn't available
if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
  rsvg-convert -w 192 -h 192 icon.svg -o icon-192.png
  rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png
  echo "Icons generated!"
elif command -v convert &> /dev/null; then
  convert -background none -resize 512x512 icon.svg icon-512.png
  convert -background none -resize 192x192 icon.svg icon-192.png
  convert -background none -resize 180x180 icon.svg apple-touch-icon.png
  echo "Icons generated with ImageMagick!"
else
  echo "No SVG-to-PNG converter found."
  echo "Open generate-icons.html in a browser to download the PNG icons."
fi
