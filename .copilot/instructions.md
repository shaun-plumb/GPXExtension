# Copilot Instructions for GPX Route Exporter

## Version Management

After making code changes to the extension, automatically increment the patch version in `manifest.json`.

### Version Format
The extension uses semantic versioning: `MAJOR.MINOR.PATCH`
- Current version: 1.0.0
- Patch increments: 1.0.0 → 1.0.1 → 1.0.2, etc.

### When to Update
Update the version after:
- Fixing bugs
- Adding features
- Improving existing functionality
- Making any changes to source code files in `src/`

### How to Update
1. Locate the version field in `manifest.json` (line 4)
2. Extract the current version (e.g., "1.0.0")
3. Increment the PATCH version number (last digit)
   - Example: 1.0.0 → 1.0.1
4. Replace the version string in manifest.json
5. Rebuild the extension with `bash build.sh`

### Implementation
Always include version bump in your changes when you:
- Edit any files in `src/` directory
- Modify build.sh or manifest.json
- Fix or implement features

The version bump should be done as a separate edit operation after the main changes are complete, just before rebuilding.

### Example
```
Old version: "version": "1.0.5"
New version: "version": "1.0.6"
```
