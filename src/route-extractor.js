/**
 * Extract waypoints from the encoded routing data parameter
 * @param {string} pb - The encoded route data from Google Maps
 * @returns {WayPoint[]} Array of WayPoint objects
 */
function extractWayPoints(pb) {
  const wayPoints = [];
  const tokens = pb.split('!');

  let lat = null;
  let lon = null;
  let silent = false;

  for (const token of tokens) {
    if (token.length === 0) continue;

    // 3m4 is the marker for a silent waypoint
    if (token.startsWith('3m4')) {
      silent = true;
    }

    try {
      // Based on observation:
      // 1d: Longitude
      // 2d: Latitude
      // 3d: Latitude
      // 4d: Longitude
      if (token.startsWith('1d')) {
        lon = parseFloat(token.substring(2));
      } else if (token.startsWith('2d')) {
        lat = parseFloat(token.substring(2));
      } else if (token.startsWith('3d')) {
        lat = parseFloat(token.substring(2));
        // 3d/4d format seems to be always non-silent (named)
        silent = false;
      } else if (token.startsWith('4d')) {
        lon = parseFloat(token.substring(2));
        silent = false;
      }
    } catch (e) {
      // Ignore number format exceptions
    }

    if (lat !== null && lon !== null) {
      wayPoints.push(new WayPoint(lat, lon, silent));
      lat = null;
      lon = null;
      silent = false; // Reset for next waypoint
    }
  }

  return wayPoints;
}
