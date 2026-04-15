#!/bin/bash
# Build script for GPX Route Exporter extension

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_DIR/build"

echo "GPX Route Exporter - Build Script"
echo "=================================="

# Create build directory
echo "Creating build directory..."
mkdir -p "$BUILD_DIR"

# Copy all necessary files
echo "Copying files to build directory..."
cp "$PROJECT_DIR/manifest.json" "$BUILD_DIR/"
cp -r "$PROJECT_DIR/src" "$BUILD_DIR/"

# Verify manifest.json is valid JSON
echo "Validating manifest.json..."
if ! python3 -m json.tool "$BUILD_DIR/manifest.json" > /dev/null; then
    echo "ERROR: manifest.json is not valid JSON"
    exit 1
fi

# Check required files exist
echo "Verifying required files..."
REQUIRED_FILES=(
    "manifest.json"
    "src/popup.html"
    "src/popup.js"
    "src/styles.css"
    "src/content.js"
    "src/waypoint.js"
    "src/route-extractor.js"
    "src/route-extractor-util.js"
    "src/gpx-creator.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        echo "ERROR: Missing required file: $file"
        exit 1
    fi
done

echo ""
echo "Build successful!"
echo "=================="
echo ""
echo "Extension files are in: $BUILD_DIR"
echo ""
echo "Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select: $BUILD_DIR"
echo ""
echo "To test:"
echo "5. Go to https://www.google.com/maps/dir/"
echo "6. Create a route"
echo "7. Click the extension icon"
echo "8. Click 'Export to GPX'"
echo ""
