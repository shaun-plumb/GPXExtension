# GPX Route Exporter Chrome Extension

A Chrome extension that exports Google Maps routing results to GPX format. It converts the route data from Google Maps URL parameters into a standard GPX file that can be used with GPS devices and navigation software.

## Features

- **One-click export**: Simply click the extension button while viewing a Google Maps route
- **Accurate waypoint extraction**: Parses Google Maps routing data to identify all waypoints
- **Via points and shaping points**: Correctly identifies and marks via points (user waypoints) and shaping points (route guidance points)
- **Standard GPX format**: Generates GPX 1.1 files compatible with most GPS software and devices
- **Automatic download**: Generated files download automatically to your Downloads folder

## Project Structure

```
GPXExtension/
├── manifest.json              # Chrome extension configuration
├── README.md                  # This file
├── src/
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup logic and button handlers
│   ├── styles.css            # Popup styling
│   ├── content.js            # Content script for Google Maps pages
│   ├── waypoint.js           # WayPoint class definition
│   ├── route-extractor.js    # Route data parsing logic
│   ├── route-extractor-util.js # URL extraction utilities
│   ├── gpx-creator.js        # GPX file generation
│   └── icons/                # Extension icons (placeholder)
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
└── build/                    # (Created during setup)
```

## How It Works

### 1. URL Parsing
When you click the extension button on a Google Maps routing page (e.g., `https://www.google.com/maps/dir/Amsterdam/Rotterdam/@52.37,4.89/...`), the extension:
- Extracts the route name by combining the segment immediately after `/dir/` and the segment immediately preceding `/@...`
  - For example: `/dir/Amsterdam/Rotterdam/@...` → route name: `Amsterdam_Rotterdam`
  - For routes with waypoints: `/dir/Start/Via1/Via2/End/@...` → route name: `Start_End` (start + end location)
- Extracts the encoded route `data` parameter from the URL query string

### 2. Data Decoding
The extension URL-decodes the `data` parameter, which contains all the waypoint information encoded by Google Maps.

### 3. Waypoint Extraction
Using the same parsing logic as the original Java code, the extension:
- Splits the data by `!` delimiters
- Parses latitude (2d, 3d) and longitude (1d, 4d) tokens
- Identifies silent waypoints (shaping points) from the `3m4` marker
- Creates WayPoint objects with all the route information

### 4. GPX Generation
The extension creates a standard GPX 1.1 file with:
- Route name (from the extracted URL segments)
- All waypoints with proper lat/lon coordinates
- Extensions marking via points and shaping points
- Garmin TripExtensions for transportation mode (Automotive)

### 5. Download
The generated GPX file is converted to a blob and automatically downloaded to your Downloads folder.

## Setup Instructions

### Prerequisites
- Google Chrome (or Chromium-based browser)
- Basic understanding of Chrome extension installation

### Option 1: Manual Installation (Development Mode)

1. **Clone or download the extension files**:
   ```bash
   cd ~/GPXExtension
   ```

2. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/` in your browser
   - Or: Menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**:
   - Click "Load unpacked"
   - Navigate to the `GPXExtension` directory
   - Click "Select Folder"

5. **Verify Installation**:
   - You should see the "GPX Route Exporter" extension in your extensions list
   - The extension icon should appear in your browser toolbar

### Option 2: Build and Package (Future Use)

To create a packaged extension (`.crx` file):

1. **In Chrome Extensions Page**:
   - With Developer mode enabled, look for "Pack extension"
   - Select the extension folder
   - Choose a location to save the `.crx` file

2. **Share or distribute** the `.crx` file to other users

## Building and Testing

### Running Tests (No test framework currently included)

To manually test the extension:

1. **Load the extension** following the setup instructions above
2. **Go to a Google Maps routing page**:
   - Example: https://www.google.com/maps/dir/Amsterdam/Rotterdam
   - Create a route with waypoints
3. **Click the extension icon** in your browser toolbar
4. **Click "Export to GPX"** button
5. **Verify**:
   - A GPX file should download automatically
   - Check the file opens correctly in a GPX viewer
   - Verify all waypoints are present

### Development

To make changes to the extension:

1. **Edit the source files** in `src/`
2. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the reload icon for the GPX Route Exporter extension
3. **Test your changes** on Google Maps

### Debugging

- **Open the popup console**: Right-click the extension icon → Inspect popup
- **View content script logs**: Open DevTools on the Google Maps page (F12)
- **Check extension errors**: Go to `chrome://extensions/` and look for error messages

## File Reference

### Core Components

**waypoint.js**
- `WayPoint` class: Represents a single waypoint with latitude, longitude, silent flag, and optional name

**route-extractor.js**
- `extractWayPoints(pb)`: Parses encoded route data and returns array of WayPoint objects
- Implements the same parsing logic as the original Java code

**route-extractor-util.js**
- `extractRouteInfo(url)`: Parses Google Maps URL to extract route name and data parameter
- `decodeMapData(encodedData)`: URL-decodes the data parameter

**gpx-creator.js**
- `createGPX(routeName, wayPoints)`: Generates GPX XML and triggers download
- `escapeXml(str)`: Sanitizes strings for XML output

**content.js**
- Runs on Google Maps pages
- Listens for messages from the popup
- Extracts route information from the current page URL

**popup.js**
- Handles button clicks and user interactions
- Communicates with content script
- Manages UI updates and error messages

### Configuration

**manifest.json**
- Extension metadata and permissions
- Content script configuration
- Host permissions for Google Maps

**popup.html**
- Extension popup UI structure

**styles.css**
- Popup styling (responsive, accessible design)

## Supported URL Formats

The extension supports Google Maps routing URLs including:

- Basic routes: `https://www.google.com/maps/dir/Start/End/...`
- Routes with coordinates: `https://www.google.com/maps/dir/52.37,4.89/51.50,5.75/...`
- Mobile routes: Same format, detected automatically
- Routes with waypoints: Any number of intermediate waypoints

## Troubleshooting

### Extension doesn't show up
- Make sure Developer mode is enabled in Chrome Extensions
- Try removing and re-adding the extension
- Check the browser console for errors

### Export button does nothing
- Ensure you're on a Google Maps routing page (`google.com/maps/dir/...`)
- Open browser DevTools (F12) and check the Console for error messages
- Try a simpler route (start → end without complex waypoints)

### GPX file doesn't download
- Check your browser's download settings
- Try allowing popups for google.com
- Check that your Downloads folder has write permissions

### Waypoints are missing or incorrect
- The extension relies on Google Maps' URL encoding format
- Some older routes may use different formatting
- Create a new route and try again

## Data Privacy

- This extension works entirely offline after loading
- No data is sent to external servers
- Route information is only extracted from the visible URL
- Generated GPX files are stored locally on your computer

## Limitations

- Only works on Google Maps routing pages
- Requires the route to have the `data` parameter in the URL
- Some historical routes may have different encoding formats
- Performance depends on the number of waypoints (usually not an issue)

## Browser Compatibility

- **Chrome**: 88+ (Manifest v3 support)
- **Edge**: 88+ (Chromium-based)
- **Brave**: Latest versions
- **Opera**: Latest versions (with some limitations)

Note: The extension uses Manifest v3, which is required for modern Chrome extensions.

## Future Enhancements

Potential features for future versions:
- Route simplification options
- Color coding for different waypoint types
- Import existing GPX files to compare routes
- Route statistics (distance, elevation)
- Support for other map providers (OpenStreetMap, etc.)
- Batch export of multiple routes
- Custom naming conventions for routes

## Contributing

To report bugs or suggest improvements:
1. Test thoroughly with different route types
2. Document the specific URL that caused the issue
3. Note any error messages from the console
4. Describe the expected vs. actual behavior

## License

This extension is provided as-is. Feel free to modify and distribute.

## Credits

Originally converted from Java source code (Main.java) to JavaScript/Chrome extension format.

The extension uses:
- Chrome Extensions API
- DOM/XML APIs for GPX generation
- Standard JavaScript ES6+ features

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-15
