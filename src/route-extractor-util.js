/**
 * Extract route information from Google Maps URL
 * @param {string} url - The Google Maps URL
 * @returns {object} Object with routeName, locationNames, and data properties, or null if invalid
 */
function extractRouteInfo(url) {
  try {
    const mapsUrl = new URL(url);
    const pathname = mapsUrl.pathname;

    // Check if this is a routing URL
    if (!pathname.includes('/dir/')) {
      return null;
    }

    // Extract the segment after /dir/
    const dirIndex = pathname.indexOf('/dir/');
    const afterDir = pathname.substring(dirIndex + 5);
    
    // Find the /@ marker
    const atIndex = afterDir.indexOf('/@');
    if (atIndex === -1) {
      return null;
    }

    // Everything between /dir/ and /@
    const pathSegment = afterDir.substring(0, atIndex);
    
    // Split by / to get all location names
    const locationNames = pathSegment.split('/').filter(name => name.length > 0);
    
    // Find the last / to get the segment immediately preceding /@
    const lastSlashIndex = pathSegment.lastIndexOf('/');
    let routeName;
    
    if (lastSlashIndex !== -1) {
      // There are intermediate waypoints
      // Get first segment (after /dir/) and last segment (before /@)
      const firstSegment = pathSegment.substring(0, pathSegment.indexOf('/'));
      const lastSegment = pathSegment.substring(lastSlashIndex + 1);
      routeName = `${firstSegment}_${lastSegment}`;
    } else {
      // Simple route with just start and end
      routeName = pathSegment;
    }

    // Extract 'data' parameter - can be in pathname or query string
    let data = null;
    
    // First, try to get from pathname (format: /data=...)
    if (pathname.includes('/data=')) {
      const dataIndex = pathname.indexOf('/data=');
      data = pathname.substring(dataIndex + 6);
    } 
    // If not found, try query string
    else {
      const params = new URLSearchParams(mapsUrl.search);
      data = params.get('data');
    }

    if (!data) {
      return null;
    }

    return {
      routeName: routeName,
      locationNames: locationNames,
      data: data
    };
  } catch (error) {
    console.error('Error extracting route info:', error);
    return null;
  }
}

/**
 * Decode the data parameter from Google Maps URL (handles encoded URL parameters)
 * @param {string} encodedData - The encoded data parameter
 * @returns {string} The decoded data string
 */
function decodeMapData(encodedData) {
  try {
    // URL decode the parameter
    const decoded = decodeURIComponent(encodedData);
    return decoded;
  } catch (error) {
    console.error('Error decoding map data:', error);
    return encodedData;
  }
}
