#!/bin/bash

# This script generates placeholder icons using ImageMagick
# Install with: brew install imagemagick
# Or create icons manually in your preferred graphics editor

# Create 16x16 icon
convert -size 16x16 xc:blue \
  -pointsize 8 -fill white -gravity center \
  -annotate +0+0 "GPX" \
  icon-16.png 2>/dev/null || echo "ImageMagick not found. Create icons manually or install ImageMagick."

# Create 48x48 icon
convert -size 48x48 xc:blue \
  -pointsize 14 -fill white -gravity center \
  -annotate +0+0 "GPX" \
  icon-48.png 2>/dev/null

# Create 128x128 icon
convert -size 128x128 xc:blue \
  -pointsize 32 -fill white -gravity center \
  -annotate +0+0 "GPX" \
  icon-128.png 2>/dev/null

echo "Icons generated (or manually create them)"
