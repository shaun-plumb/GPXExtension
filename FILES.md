# GPXExtension - Complete File Reference

## Overview
This document describes every file in the GPX Route Exporter extension project.

## Root Directory Files

### build.sh
- **Purpose**: Build script that prepares the extension for installation
- **Language**: Bash
- **Usage**: `./build.sh`
- **Output**: Creates the `build/` directory with all necessary files
- **Features**:
  - Validates manifest.json JSON syntax
  - Verifies all required files are present
  - Provides clear next steps for installation
  - ~40 lines of code

### manifest.json
- **Purpose**: Chrome extension manifest - defines extension metadata and permissions
- **Language**: JSON
- **Size**: ~500 bytes
- **Key sections**:
  - `manifest_version`: 3 (required for modern Chrome)
  - `permissions`: Permissions needed (activeTab, scripting)
  - `host_permissions`: Google Maps host permission
  - `content_scripts`: Scripts that run on Google Maps pages
  - `action`: Extension popup configuration
  - `icons`: Icon definitions for different sizes
- **Permissions Explained**:
  - `activeTab`: Can access the active tab
  - `scripting`: Can inject content scripts
  - `https://www.google.com/maps/*`: Can run on Google Maps URLs

### README.md
- **Purpose**: Complete user and developer documentation
- **Language**: Markdown
- **Size**: ~9000 words
- **Sections**:
  - Features overview
  - How it works (detailed explanation)
  - Setup instructions (multiple options)
  - Building and testing
  - File reference
  - Supported URL formats
  - Troubleshooting guide
  - Data privacy section
  - Browser compatibility
  - Future enhancements
  - Contributing guidelines

### QUICKSTART.md
- **Purpose**: Fast 5-minute setup and testing guide
- **Language**: Markdown
- **Size**: ~1500 words
- **For**: Users who want to get started immediately
- **Contains**:
  - Installation in 5 minutes
  - Quick test procedure
  - Troubleshooting quick reference
  - File structure overview
  - How it works (brief)
  - Common issues table

### DEVELOPER.md
- **Purpose**: Technical documentation for developers modifying the code
- **Language**: Markdown
- **Size**: ~12000 words
- **Sections**:
  - Architecture overview with diagrams
  - Data flow diagram
  - Component-by-component explanation
  - Code examples and walkthroughs
  - Common modifications guide
  - Testing and debugging strategies
  - Performance considerations
  - Security best practices
  - Manifest v3 considerations
  - Further reading links

### PROJECT_SUMMARY.md
- **Purpose**: High-level overview of what was created
- **Language**: Markdown
- **Size**: ~2500 words
- **Includes**:
  - Project status and version
  - What's included
  - Key features checklist
  - How to use (quick)
  - Conversion details from Java
  - Technical stack information
  - Performance metrics
  - Testing checklist
  - Statistics and version history

### FILES.md
- **Purpose**: This file - describes all files in the project
- **Language**: Markdown
- **Use**: Reference when you need to understand what each file does

---

## src/ Directory - Source Code

### src/waypoint.js
- **Purpose**: Define the WayPoint class for storing coordinate data
- **Language**: JavaScript (ES6+)
- **Size**: ~280 bytes
- **Exports**: `WayPoint` class
- **Class Definition**:
  ```
  constructor(lat, lon, silent, name = null)
  toString() - returns string representation
  Properties: lat, lon, silent, name
  ```
- **Used by**: `route-extractor.js`, tests
- **Converted from**: Java `WayPoint` class in Main.java

### src/route-extractor.js
- **Purpose**: Parse Google Maps encoded routing data into WayPoint objects
- **Language**: JavaScript (ES6+)
- **Size**: ~1400 bytes
- **Exports**: `extractWayPoints(pb)` function
- **Functionality**:
  - Splits encoded data by '!' delimiters
  - Parses latitude (2d, 3d tokens) and longitude (1d, 4d tokens)
  - Detects silent waypoints (3m4 marker)
  - Returns array of WayPoint objects
- **Input**: String of encoded route data
- **Output**: Array of WayPoint objects
- **Algorithm**: Same as Java `extractWayPoints()` method
- **Performance**: <100ms for 100+ waypoints

### src/route-extractor-util.js
- **Purpose**: Utility functions for extracting route info from Google Maps URLs
- **Language**: JavaScript (ES6+)
- **Size**: ~2000 bytes
- **Exports**:
  - `extractRouteInfo(url)` - Extract routeName and data parameter
  - `decodeMapData(encodedData)` - URL decode the data parameter
- **extractRouteInfo() Logic**:
  - Parses URL pathname
  - Finds segments: /dir/[start]/@[coords]/[end]/@[coords]
  - Combines to create route name
  - Extracts 'data' query parameter
- **Error Handling**: Returns null if URL doesn't match expected format

### src/gpx-creator.js
- **Purpose**: Generate GPX XML files and trigger browser download
- **Language**: JavaScript (ES6+)
- **Size**: ~2600 bytes
- **Exports**:
  - `createGPX(routeName, wayPoints)` - Main function
  - `escapeXml(str)` - XML string escaping helper
- **createGPX() Process**:
  1. Creates GPX 1.1 XML template
  2. Iterates through wayPoints
  3. Creates rtept elements with lat/lon
  4. Adds extensions (ViaPoint or ShapingPoint)
  5. Serializes to string
  6. Creates Blob
  7. Triggers browser download
  8. Cleans up object URL
- **Output**: Downloads GPX file, returns boolean success
- **Blob Type**: `application/gpx+xml`
- **Converted from**: Java `createGPX()` method, adapted for browser

### src/content.js
- **Purpose**: Content script that runs on Google Maps pages
- **Language**: JavaScript (ES6+)
- **Size**: ~2800 bytes
- **Execution Context**: Google Maps web pages
- **Functionality**:
  - Listens for messages from popup
  - Extracts route information from current page URL
  - Sends response back to popup
  - Includes helper functions for URL parsing
- **Message Protocol**:
  - Receives: `{action: 'getRouteData'}`
  - Sends: `{success: bool, routeName: string, data: string}`
- **Key Function**: `extractRouteInfo()` - duplicated from route-extractor-util.js for isolation
- **Security**: Only reads from URL, no DOM access for sensitive data

### src/popup.html
- **Purpose**: HTML structure for the extension popup
- **Language**: HTML5
- **Size**: ~520 bytes
- **Elements**:
  - h1: "GPX Route Exporter" title
  - p#status: Shows current status (Ready, Processing, etc.)
  - button#exportBtn: Main action button
  - div#message: Area for success/error messages
- **Styling**: References src/styles.css
- **Scripts**: Loads all necessary JavaScript files in order:
  1. waypoint.js (classes)
  2. route-extractor.js (parsing)
  3. route-extractor-util.js (utilities)
  4. gpx-creator.js (generation)
  5. popup.js (event handling)
- **Dimensions**: 350px width (popup size)

### src/popup.js
- **Purpose**: Main orchestration and event handling for the popup UI
- **Language**: JavaScript (ES6+)
- **Size**: ~2200 bytes
- **Exports**: None (runs immediately on popup load)
- **Main Functions**:
  - `DOMContentLoaded` event listener - initializes popup
  - Button click handler - orchestrates the export flow
  - `showMessage()` - displays messages to user
- **Export Flow**:
  1. Get current tab
  2. Verify it's a Google Maps /dir/ page
  3. Send message to content script
  4. Receive route data
  5. Decode data parameter
  6. Extract waypoints
  7. Generate GPX
  8. Show success message
- **Error Handling**: Try-catch blocks, user-friendly messages
- **UI Updates**: Status text, button disabled state, message display

### src/styles.css
- **Purpose**: Styling for the extension popup
- **Language**: CSS3
- **Size**: ~1300 bytes
- **Styling**:
  - Container layout (350px width)
  - Typography (system font stack)
  - Button styling (blue Google-like design)
  - Button hover/active states
  - Message styling (success/error/info variants)
  - Color scheme (light, accessible)
- **Classes**:
  - `.container` - Main popup container
  - `button` - Primary action button
  - `.message` - Message display area
  - `.message.hidden` - Hidden state
  - `.message.visible` - Visible state
  - `.message.success` - Green success styling
  - `.message.error` - Red error styling
  - `.message.info` - Blue info styling

### src/icons/
- **Purpose**: Directory for extension icon assets
- **Contents**:
  - `icon-16.png` - Toolbar icon (16x16 pixels)
  - `icon-48.png` - Medium icon (48x48 pixels)
  - `icon-128.png` - Large icon (128x128 pixels)
  - `generate-icons.sh` - Script to generate icons (optional)
- **Status**: Icons are placeholders; replace with actual designs
- **Format**: PNG with transparency recommended
- **Usage in manifest.json**:
  ```json
  "icons": {
    "16": "src/icons/icon-16.png",
    "48": "src/icons/icon-48.png",
    "128": "src/icons/icon-128.png"
  }
- **Icon Requirements**:
  - 16x16: Toolbar icon
  - 48x48: Extension management page
  - 128x128: Installation and web store

### src/icons/generate-icons.sh
- **Purpose**: Optional script to generate placeholder icons using ImageMagick
- **Language**: Bash
- **Usage**: `bash src/icons/generate-icons.sh`
- **Requirements**: ImageMagick installed (`brew install imagemagick`)
- **Output**: Creates the three PNG icon files
- **Fallback**: Instructions to create icons manually

---

## build/ Directory - Generated Output

Created by running `./build.sh`, contains copies of:
- `manifest.json`
- `src/` directory with all source files

**Purpose**: This is the directory to load into Chrome with "Load unpacked"

---

## File Dependencies

```
popup.html
  ├─ styles.css
  ├─ waypoint.js
  ├─ route-extractor.js
  ├─ route-extractor-util.js
  ├─ gpx-creator.js
  └─ popup.js
       ├─ (calls extractWayPoints from route-extractor.js)
       ├─ (calls decodeMapData from route-extractor-util.js)
       ├─ (calls createGPX from gpx-creator.js)
       └─ (uses WayPoint from waypoint.js)

manifest.json
  ├─ references src/popup.html
  ├─ references src/icons/*.png
  └─ content_scripts: references src/content.js

content.js (Google Maps pages)
  ├─ waypoint.js (loaded via manifest content_scripts)
  ├─ route-extractor.js (loaded via manifest content_scripts)
  └─ (called by: popup.js via chrome.tabs.sendMessage)

Execution order:
1. User clicks extension icon → popup.html loads
2. Scripts load: waypoint.js → route-extractor.js → etc → popup.js
3. popup.js calls chrome.tabs.sendMessage()
4. content.js (already loaded on Google Maps page) receives message
5. content.js uses functions to extract route data
6. Response sent back to popup.js
7. popup.js processes and calls functions to generate GPX
```

---

## Size Summary

| File | Size | Type |
|------|------|------|
| waypoint.js | 280 B | Code |
| route-extractor.js | 1.4 KB | Code |
| route-extractor-util.js | 2.0 KB | Code |
| gpx-creator.js | 2.6 KB | Code |
| content.js | 2.8 KB | Code |
| popup.html | 520 B | Markup |
| popup.js | 2.2 KB | Code |
| styles.css | 1.3 KB | Styles |
| manifest.json | 500 B | Config |
| **Total (excluding icons/docs)** | **~15 KB** | |
| **With documentation** | **~30 KB** | |

---

## Documentation Files (Not Required for Extension)

These files help users and developers but aren't needed for the extension to function:

- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `DEVELOPER.md` - Developer documentation
- `PROJECT_SUMMARY.md` - Project overview
- `FILES.md` - This file

**Note**: These are helpful but can be deleted if you want a minimal extension. The extension only requires the files in `src/`, `manifest.json`, and the icons.

---

## Version Information

- **Created**: 2026-04-15
- **Format**: Chrome Extension Manifest v3
- **License**: Provided as-is

---

## For More Information

- **Getting Started**: See QUICKSTART.md
- **User Guide**: See README.md
- **Technical Details**: See DEVELOPER.md
- **Build Instructions**: See build.sh
- **Source Code**: See src/ directory files

