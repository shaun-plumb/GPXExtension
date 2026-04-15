# Installation & Setup Instructions

## Pre-Installation Checklist

Before you begin, make sure you have:
- ✅ Google Chrome (version 88 or later)
- ✅ Access to this directory: `~/GPXExtension/`
- ✅ Terminal access (to run build script)

## Installation Steps

### Step 1: Build the Extension (1 minute)

Open a terminal and run:

```bash
cd ~/GPXExtension
./build.sh
```

You should see output like:
```
GPX Route Exporter - Build Script
==================================
Creating build directory...
Copying files to build directory...
Validating manifest.json...
Verifying required files...

Build successful!
==================

Extension files are in: /Users/shaunplumb/GPXExtension/build
```

If you see any errors, check the troubleshooting section below.

### Step 2: Open Chrome Extensions Page (1 minute)

In Google Chrome:
1. Click the three-dot menu (⋮) in the top-right corner
2. Hover over "More tools"
3. Click "Extensions"

Or directly navigate to: `chrome://extensions/`

### Step 3: Enable Developer Mode (1 minute)

In the Extensions page:
1. Look at the top-right corner
2. Find the toggle for "Developer mode"
3. Click it to turn it ON (it should turn blue)

The page should now show additional options like "Load unpacked" and "Pack extension"

### Step 4: Load the Extension (1 minute)

1. Click the "Load unpacked" button
2. A file browser dialog will open
3. Navigate to the `~/GPXExtension/build` directory
4. Click "Select Folder" (or just "Open" depending on your system)

Chrome will now load the extension and display it in your extensions list.

### Step 5: Verify Installation (1 minute)

You should now see:
- A new extension called "GPX Route Exporter" in your extensions list
- A new icon in your Chrome toolbar (may appear as a blue icon with "GPX" on it)
- Status showing "Installed" or similar

If the icon doesn't appear in the toolbar:
1. Right-click the extension in your extensions list
2. Click "Show in toolbar"

**Congratulations! The extension is now installed.**

---

## Quick Test (5 minutes)

Now let's test that everything works:

### Test Steps:

1. **Go to Google Maps**
   - Open https://www.google.com/maps/dir/ in Chrome
   - Or go to google.com/maps and click "Directions"

2. **Create a Simple Route**
   - Type a start location (e.g., "Amsterdam")
   - Type an end location (e.g., "Rotterdam")
   - Press Enter to generate the route
   - Google Maps will show you the route on the map

3. **Export to GPX**
   - Click the GPX Route Exporter extension icon in your toolbar
   - A popup window will appear
   - Click the blue "Export to GPX" button

4. **Check the Download**
   - A file should automatically download
   - Check your Downloads folder
   - You should see a file named something like: `Amsterdam_52.37_4.89_...gpx`

5. **Verify the File**
   - The file should be a text file (GPX is XML-based)
   - You can open it with any text editor to see the contents
   - Or open it with a GPX viewer:
     - Google Earth
     - Garmin BaseCamp
     - Online GPX viewers (search "GPX viewer online")

**If all steps worked, the extension is ready to use!**

---

## Troubleshooting Installation

### Problem: "Load unpacked" button doesn't appear

**Solution:**
1. Make sure "Developer mode" toggle is ON (should be blue)
2. The toggle is in the top-right corner of the Extensions page
3. If it's still not visible, try refreshing the page (Ctrl+R or Cmd+R)

### Problem: Error when loading unpacked

**Most common causes:**
- Wrong directory selected (must select the `build` folder inside `~/GPXExtension/`)
- build.sh script wasn't run (run it first)
- manifest.json has errors (the build script validates this)

**Solution:**
1. Run the build script again: `./build.sh`
2. Double-check you're selecting: `/Users/shaunplumb/GPXExtension/build`
3. Try removing the extension and re-adding it

### Problem: Extension appears but icon doesn't show in toolbar

**Solution:**
1. Right-click the extension name
2. Select "Show in toolbar"
3. The icon should now appear next to your address bar

### Problem: "Export to GPX" button is disabled/greyed out

**Cause:** You're not on a Google Maps routing page

**Solution:**
1. Go to https://www.google.com/maps/dir/
2. Create a route (start and end location)
3. Make sure the URL contains `/dir/` in the address bar
4. Wait for the map to fully load
5. Try the button again

### Problem: No GPX file downloads

**Solution:**
1. Check your Downloads folder - it might be there
2. Check Chrome's download permissions:
   - Menu → Settings → Privacy and security → Site settings → Downloads
   - Make sure google.com is allowed to download
3. Open the browser console (F12 → Console tab) and look for errors
4. Try a simpler route (fewer waypoints)

### Problem: Build script fails

**Cause:** Python 3 might not be installed

**Solution:**
```bash
# Check if Python 3 is available
python3 --version

# If not, install it (macOS with Homebrew)
brew install python3

# Then try the build script again
./build.sh
```

### Problem: GPX file is empty or has no waypoints

**Solution:**
1. Make sure you created a complete route on Google Maps
2. The route should show on the map with a blue line
3. Create a route with multiple waypoints (not just start → end)
4. Try refreshing the page and creating a new route

---

## Uninstalling the Extension

If you want to remove the extension later:

1. Go to `chrome://extensions/`
2. Find "GPX Route Exporter"
3. Click the remove button (trash icon) in the bottom-right of the extension card
4. Confirm the removal

The extension will be deleted from Chrome.

---

## Updating the Extension

To update the extension after making changes:

1. Edit the source files in `~/GPXExtension/src/` if needed
2. Run the build script again: `./build.sh`
3. Go to `chrome://extensions/`
4. Click the reload icon (circular arrow) on the GPX Route Exporter extension
5. Wait for it to finish reloading

The updated extension will be ready immediately.

---

## Next Steps

After successful installation:

1. **Learn more**: Read the [QUICKSTART.md](QUICKSTART.md) for tips and tricks
2. **Full documentation**: See [README.md](README.md) for complete details
3. **Development**: See [DEVELOPER.md](DEVELOPER.md) if you want to modify the code
4. **File reference**: See [FILES.md](FILES.md) to understand what each file does

---

## Need Help?

If you run into issues:

1. **Check the troubleshooting section** above
2. **Read the README.md** for common issues
3. **Check Chrome's error messages**:
   - Go to `chrome://extensions/`
   - Click on the extension
   - Look for error messages
   - Check the developer console (F12) on Google Maps pages

---

## Verification Checklist

After installation, verify:

- [ ] Extension appears in `chrome://extensions/`
- [ ] Icon appears in toolbar
- [ ] Can navigate to Google Maps routing page
- [ ] "Export to GPX" button appears when popup is opened
- [ ] Button is enabled on a `/dir/` page
- [ ] Clicking button downloads a GPX file
- [ ] Downloaded file has `.gpx` extension
- [ ] File opens in a text editor showing XML content

---

**Installation Date**: _______________  
**Status**: ☐ Complete ☐ In Progress ☐ Needs Help

---

For detailed usage information, see [QUICKSTART.md](QUICKSTART.md)
