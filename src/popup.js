/**
 * Popup script - handles button clicks and user interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const statusText = document.getElementById('status');
  const message = document.getElementById('message');

  exportBtn.addEventListener('click', async () => {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if we're on a Google Maps routing page
      if (!tab.url.includes('google.com/maps/dir/')) {
        showMessage('Not on a Google Maps routing page. Please navigate to a route first.', 'error');
        return;
      }

      exportBtn.disabled = true;
      statusText.textContent = 'Processing...';

      // Execute content script to extract route information
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'getRouteData' }).catch(error => {
        console.error('Message sending error:', error);
        throw new Error('Content script not ready. Please make sure you\'re on a Google Maps page and refresh if needed.');
      });

      if (!result || !result.success) {
        showMessage(result?.error || 'Failed to extract route data', 'error');
        statusText.textContent = 'Ready';
        exportBtn.disabled = false;
        return;
      }

      const { routeName, locationNames, data } = result;

      // Decode the data parameter
      const decodedData = decodeMapData(data);

      // Extract waypoints
      const wayPoints = extractWayPoints(decodedData);

      if (wayPoints.length === 0) {
        showMessage('No waypoints found in the route', 'error');
        statusText.textContent = 'Ready';
        exportBtn.disabled = false;
        return;
      }

      // Assign location names to non-silent waypoints
      assignWayPointNames(wayPoints, locationNames);

      // Create and download GPX
      createGPX(routeName, wayPoints);

      showMessage(`Successfully exported ${wayPoints.length} waypoint(s) to GPX`, 'success');
      statusText.textContent = 'Ready';
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error: ' + error.message, 'error');
      statusText.textContent = 'Ready';
      exportBtn.disabled = false;
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message visible ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      message.className = 'message hidden';
    }, 5000);
  }
});

/**
 * Assign location names from the URL to non-silent waypoints
 * @param {WayPoint[]} wayPoints - Array of waypoints
 * @param {string[]} locationNames - Array of location names from URL
 */
function assignWayPointNames(wayPoints, locationNames) {
  // Get indices of non-silent waypoints
  const nonSilentIndices = [];
  for (let i = 0; i < wayPoints.length; i++) {
    if (!wayPoints[i].silent) {
      nonSilentIndices.push(i);
    }
  }

  // Assign location names to non-silent waypoints
  for (let i = 0; i < nonSilentIndices.length && i < locationNames.length; i++) {
    const waypointIndex = nonSilentIndices[i];
    wayPoints[waypointIndex].name = locationNames[i].replaceAll('+', ' ');
  }
}
