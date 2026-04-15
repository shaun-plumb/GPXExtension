# Quick Start Guide - GPX Route Exporter

## Installation (5 minutes)

### Step 1: Build the Extension
```bash
cd ~/GPXExtension
./build.sh
```

### Step 2: Load into Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Toggle **"Developer mode"** ON (top right corner)
3. Click **"Load unpacked"**
4. Select the `~/GPXExtension/build` folder
5. Click "Select Folder"

### Step 3: You're Done!
The "GPX Route Exporter" should now appear in your extensions list and toolbar.

---

## Quick Test

1. Go to https://www.google.com/maps/dir/
2. Enter a start location (e.g., "Amsterdam")
3. Enter an end location (e.g., "Rotterdam")
4. Add some waypoints by clicking the + icon
5. Once Google Maps shows your complete route, click the **extension icon** in the toolbar
6. Click **"Export to GPX"** button
7. The GPX file should automatically download!

---

## Troubleshooting

### Extension icon not showing in toolbar
- Go to `chrome://extensions/`
- Make sure "Developer mode" is ON
- Right-click the extension name and select "Show in toolbar"

### "Not on a Google Maps routing page" error
- Make sure you're on a page with a `/dir/` URL (routing page)
- Wait for Google Maps to finish loading the route
- Check the URL starts with `https://www.google.com/maps/dir/`

### GPX file won't download
- Check Chrome's download settings
- Make sure your Downloads folder has write permissions
- Check browser console for specific errors (F12 → Console)

### No waypoints in the GPX file
- Verify the route has waypoints (you should see them on the map)
- Try creating a simpler route and testing again
- Check the browser console for error messages

---

## File Structure

```
GPXExtension/
├── build.sh               ← Run this to build the extension
├── manifest.json          ← Extension configuration
├── README.md              ← Full documentation
├── QUICKSTART.md          ← This file
└── src/
    ├── popup.html         ← Extension popup UI
    ├── popup.js           ← Button click handlers
    ├── styles.css         ← Styling
    ├── content.js         ← Runs on Google Maps pages
    ├── waypoint.js        ← WayPoint class
    ├── route-extractor.js ← Route parsing logic
    ├── route-extractor-util.js
    ├── gpx-creator.js     ← GPX file generation
    └── icons/
        ├── icon-16.png
        ├── icon-48.png
        └── icon-128.png
```

---

## How It Works (Brief Overview)

1. **You click the extension button** while viewing a Google Maps route
2. **Extension extracts the route data** from the URL and the page
3. **Parses waypoint coordinates** from the encoded route data
4. **Generates a GPX XML file** with all waypoints
5. **Automatically downloads** the GPX file to your computer

The extension works completely offline - no data is sent to any servers.

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Extension not loading | Enable Developer mode, use "Load unpacked" |
| Extension icon hidden | Right-click extension → "Show in toolbar" |
| Export button disabled | Make sure you're on a Google Maps `/dir/` page |
| No waypoints exported | Create a more complete route with multiple stops |
| GPX file won't open | Try opening in Google Earth, Garmin BaseCamp, or a GPX viewer |

---

## Next Steps

- **For basic usage**: Follow the Quick Test above
- **For full documentation**: Read `README.md`
- **For advanced features**: See the Future Enhancements section in README.md
- **For debugging**: Use Chrome DevTools (F12) on the Google Maps page

---

**Questions?** Check the README.md or look at the source code comments in `src/` folder.
