# Developer Guide - GPX Route Exporter

This guide explains the architecture and code flow for developers who want to modify or extend the extension.

## Architecture Overview

The extension works in three main layers:

```
┌─────────────────────────────────────────────────────────────┐
│ Google Chrome Browser                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Google Maps Page (Content)                          │  │
│  │                                                     │  │
│  │ content.js (Content Script)                         │  │
│  │  - Listens for messages from popup                  │  │
│  │  - Extracts route data from current URL             │  │
│  │  - Sends data back to popup                         │  │
│  └──────────────┬──────────────────────────────────────┘  │
│                 │ chrome.runtime.sendMessage()              │
│  ┌──────────────▼──────────────────────────────────────┐  │
│  │ Extension Popup (User Interface)                    │  │
│  │                                                     │  │
│  │ popup.js                                            │  │
│  │  - Handles button clicks                            │  │
│  │  - Manages UI state and messages                    │  │
│  │  - Calls helper functions                           │  │
│  │                                                     │  │
│  │ Imported Functions:                                 │  │
│  │  - extractWayPoints() from route-extractor.js       │  │
│  │  - decodeMapData() from route-extractor-util.js     │  │
│  │  - createGPX() from gpx-creator.js                  │  │
│  │  - WayPoint class from waypoint.js                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User clicks extension button
    ↓
popup.js initializes, user clicks "Export to GPX"
    ↓
popup.js sends message: {action: 'getRouteData'}
    ↓
content.js receives message
    ↓
content.js calls extractRouteInfo(currentUrl)
    ↓
content.js sends response with routeName and data parameter
    ↓
popup.js decodes data with decodeMapData()
    ↓
popup.js calls extractWayPoints(decodedData)
    ↓
extractWayPoints() parses encoded tokens and returns WayPoint[]
    ↓
popup.js calls createGPX(routeName, wayPoints)
    ↓
createGPX() generates XML and triggers download
    ↓
Browser downloads GPX file to Downloads folder
    ↓
User sees success message
```

## Key Components Explained

### 1. waypoint.js

**Purpose**: Define the WayPoint data structure

```javascript
class WayPoint {
  constructor(lat, lon, silent, name = null) {
    this.lat = lat;        // Latitude coordinate
    this.lon = lon;        // Longitude coordinate
    this.silent = silent;  // true = shaping point, false = via point
    this.name = name;      // Optional waypoint name
  }
}
```

**Usage**: 
- Created by `extractWayPoints()` for each detected point
- Passed to `createGPX()` to generate the GPX file
- Contains all the information needed to represent a waypoint

### 2. route-extractor.js

**Purpose**: Parse the encoded routing data from Google Maps

The encoded format uses tokens separated by `!`:
- `1d<value>` = Longitude
- `2d<value>` = Latitude  
- `3d<value>` = Latitude (named waypoint)
- `4d<value>` = Longitude (named waypoint)
- `3m4` = Marker for silent waypoint (shaping point)

**Example parsing**:
```
Input:  "!1m5!1m4!1s0x47...!8m2!3d52.19!4d4.499!1m5!1m4!1s0x47...!8m2!3d51.83!4d4.975!"
        
Tokens: ['', '1m5', '1m4', '1s0x47...', '8m2', '3d52.19', '4d4.499', ...]

Processing:
- 3d52.19 → lat = 52.19
- 4d4.499 → lon = 4.499
- Create WayPoint(52.19, 4.499, false)

Result: [WayPoint(52.19, 4.499, false), WayPoint(51.83, 4.975, false), ...]
```

**Key Logic**:
```javascript
for (const token of tokens) {
  if (token.startsWith('1d')) {
    lon = parseFloat(token.substring(2));
  } else if (token.startsWith('2d')) {
    lat = parseFloat(token.substring(2));
  }
  // ... more checks ...
  
  if (lat !== null && lon !== null) {
    wayPoints.push(new WayPoint(lat, lon, silent));
    // Reset for next waypoint
    lat = null;
    lon = null;
    silent = false;
  }
}
```

### 3. route-extractor-util.js

**Purpose**: Extract route information from Google Maps URLs

**extractRouteInfo(url)**:
```
Input URL:  https://www.google.com/maps/dir/Amsterdam/@52.37,4.89/Rotterdam/@51.50,5.75/?data=!4m...

Extraction:
1. Parse URL pathname: /maps/dir/Amsterdam/@52.37,4.89/Rotterdam/@51.50,5.75/
2. Find segment after /dir/: Amsterdam/@52.37,4.89/Rotterdam/@51.50,5.75/
3. Find segment before /@: Amsterdam
4. Find coordinates after /@: 52.37,4.89...
5. Build routeName: Amsterdam_52.37_4.89_...
6. Extract 'data' parameter from query string
7. Return {routeName, data}
```

**decodeMapData(encodedData)**:
- Simply calls `decodeURIComponent()` to decode URL-encoded parameters
- The data parameter is often URL-encoded by the browser

### 4. gpx-creator.js

**Purpose**: Generate GPX XML and create downloadable file

**GPX Structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:trp="http://www.garmin.com/xmlschemas/TripExtensions/v1"
     ...>
  <rte>
    <name>Route Name</name>
    <extensions>
      <trp:Trip>
        <trp:TransportationMode>Automotive</trp:TransportationMode>
      </trp:Trip>
    </extensions>
    
    <!-- Waypoints -->
    <rtept lat="52.19" lon="4.49">
      <extensions>
        <trp:ViaPoint/>  <!-- or <trp:ShapingPoint/> if silent -->
      </extensions>
    </rtept>
    ...
  </rte>
</gpx>
```

**Key Steps**:
1. Create base GPX structure using template
2. For each WayPoint:
   - Create `<rtept>` element
   - Set lat/lon attributes
   - Add `<trp:ViaPoint/>` or `<trp:ShapingPoint/>` based on silent flag
   - If named, add `<name>` element
3. Serialize DOM to string using XMLSerializer
4. Create Blob from serialized XML
5. Create download link and trigger click
6. Revoke object URL to free memory

**Download Mechanism**:
```javascript
const blob = new Blob([xmlString], { type: 'application/gpx+xml' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `${routeName}.gpx`;
document.body.appendChild(link);
link.click();  // Trigger download
document.body.removeChild(link);
URL.revokeObjectURL(url);  // Clean up
```

### 5. content.js

**Purpose**: Bridge between Google Maps page and extension popup

**Message Flow**:
```javascript
// content.js (runs on Google Maps page)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRouteData') {
    const routeInfo = extractRouteInfo(window.location.href);
    sendResponse({
      success: true,
      routeName: routeInfo.routeName,
      data: routeInfo.data
    });
  }
});

// popup.js
const result = await chrome.tabs.sendMessage(tab.id, { 
  action: 'getRouteData' 
});
```

**Security Note**:
- Content script has access to the page DOM but we only use the URL
- No sensitive data is extracted from page elements
- All processing happens in the extension popup (isolated context)

### 6. popup.js

**Purpose**: Main orchestration and UI management

**Event Handling**:
```javascript
exportBtn.addEventListener('click', async () => {
  // 1. Get current tab
  // 2. Check if on Google Maps /dir/ page
  // 3. Send message to content script
  // 4. Receive route data
  // 5. Decode and parse waypoints
  // 6. Generate GPX
  // 7. Update UI with success/error message
});
```

**Error Handling Strategy**:
- Validate tab URL before processing
- Wrap all operations in try-catch
- Show user-friendly error messages
- Keep button disabled during processing
- Re-enable button and reset status after completion

## Common Modifications

### Adding a new waypoint property

**Step 1**: Update WayPoint class in `waypoint.js`
```javascript
class WayPoint {
  constructor(lat, lon, silent, name = null, elevation = null) {
    this.elevation = elevation;
  }
}
```

**Step 2**: Update route parser in `route-extractor.js`
```javascript
// Add code to extract elevation from encoded data
if (token.startsWith('5d')) {  // Example token
  elevation = parseFloat(token.substring(2));
}
```

**Step 3**: Update GPX generator in `gpx-creator.js`
```javascript
if (wp.elevation !== null) {
  const ele = doc.createElement('ele');
  ele.textContent = wp.elevation.toString();
  rtept.appendChild(ele);
}
```

### Changing the transportation mode

In `gpx-creator.js`, find:
```javascript
<trp:TransportationMode>Automotive</trp:TransportationMode>
```

Change "Automotive" to:
- "Pedestrian" for walking routes
- "Bicycle" for cycling routes
- "Motorcycle" for motorcycle routes

### Adding custom route naming

In `route-extractor-util.js`:
```javascript
// Instead of just combining segments:
const routeName = `${startSegment}_${endSegment.replace(/,/g, '_')}`;

// Use a custom format:
const timestamp = new Date().toISOString().slice(0, 10);
const routeName = `${startSegment}_to_${endSegment}_${timestamp}`;
```

### Exporting multiple formats

Modify `createGPX()` to also generate other formats:

```javascript
function createGPX(routeName, wayPoints) {
  // ... existing GPX generation ...
  downloadGPX(blob, routeName);
  
  // Also generate KML
  const kml = generateKML(routeName, wayPoints);
  downloadKML(kml, routeName);
}
```

## Testing & Debugging

### Debugging in content.js

1. Open Google Maps page with a route
2. Open DevTools (F12)
3. Content script logs appear in the main console
4. Check `window.location.href` to verify URL

### Debugging in popup.js

1. Right-click extension icon → "Inspect popup"
2. A separate DevTools window opens for the popup
3. Set breakpoints and step through code
4. View all console logs and errors

### Common Debug Patterns

```javascript
// Log extracted waypoints
console.log('Extracted waypoints:', wayPoints);

// Log the raw encoded data
console.log('Raw data parameter:', data);

// Log the generated GPX XML
console.log('Generated XML:', xmlString);

// Check what the browser sees
console.log('Current URL:', window.location.href);
```

### Testing Edge Cases

1. **Route with no waypoints**: Just start and end
2. **Route with many waypoints**: 10+ intermediate stops
3. **Route with silent waypoints**: Check 3m4 markers are detected
4. **Mobile URL format**: Test on mobile version
5. **Non-ASCII place names**: Test with special characters

## Performance Considerations

- **Large routes**: 100+ waypoints should process instantly
- **Memory**: Blob creation is temporary and cleaned up
- **URL limits**: Some URLs are extremely long; ensure URL parsing is robust
- **XML generation**: Prefer template approach over DOM building for large documents

## Security Best Practices

1. **No external requests**: All processing is local
2. **No localStorage/cookie access**: No persistent data storage
3. **Limited permissions**: Only Google Maps host permission
4. **Input validation**: Always validate URL before parsing
5. **XML escaping**: Prevent XML injection via `escapeXml()`

## Manifest v3 Considerations

This extension uses Manifest v3, which is required for modern Chrome. Key differences from v2:

- Content scripts must be declared in manifest
- Message passing uses `chrome.tabs.sendMessage()`
- No inline scripts in HTML files
- All scripts must be loaded via `<script src="">`
- Extension runs in isolated context

## Further Reading

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [GPX Format Specification](https://www.topografix.com/GPX/1/1/)
- [Google Maps URL Structure](https://www.google.com/maps)
- [MDN: Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN: XMLSerializer](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)

---

**Last Updated**: 2026-04-15
