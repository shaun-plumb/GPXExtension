/**
 * Create GPX XML and generate a downloadable file
 * @param {string} routeName - Name of the route
 * @param {WayPoint[]} wayPoints - Array of waypoints
 */
function createGPX(routeName, wayPoints) {
  try {
    // Define namespaces
    const gpxNS = 'http://www.topografix.com/GPX/1/1';
    const trpNS = 'http://www.garmin.com/xmlschemas/TripExtensions/v1';
    const xsiNS = 'http://www.w3.org/2001/XMLSchema-instance';
    const xmlnsNS = 'http://www.w3.org/2000/xmlns/';

    // Create XML document
    const parser = new DOMParser();
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xmlns:trp="http://www.garmin.com/xmlschemas/TripExtensions/v1"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1  http://www.topografix.com/GPX/1/1/gpx.xsd "
     creator="SP TEST"
     version="1.1">
  <rte>
    <name>${escapeXml(routeName.replaceAll('+', ' '))}</name>
    <extensions>
      <trp:Trip>
        <trp:TransportationMode>Automotive</trp:TransportationMode>
      </trp:Trip>
    </extensions>
  </rte>
</gpx>`;

    const doc = parser.parseFromString(xmlString, 'text/xml');
    const rte = doc.querySelector('rte');

    for (const wp of wayPoints) {
      // Use createElementNS with the GPX namespace
      const rtept = doc.createElementNS(gpxNS, 'rtept');
      rtept.setAttribute('lat', wp.lat.toString());
      rtept.setAttribute('lon', wp.lon.toString());

      const wpext = doc.createElementNS(gpxNS, 'extensions');
      if (wp.silent) {
        wpext.appendChild(doc.createElementNS(trpNS, 'trp:ShapingPoint'));
      } else {
        wpext.appendChild(doc.createElementNS(trpNS, 'trp:ViaPoint'));
        if (wp.name) {
          const wpname = doc.createElementNS(gpxNS, 'name');
          wpname.textContent = wp.name;
          rtept.appendChild(wpname);
        }
      }

      rtept.appendChild(wpext);
      rte.appendChild(rtept);
    }

    // Serialize the XML
    const serializer = new XMLSerializer();
    const xmlString_output = serializer.serializeToString(doc);

    // Create a blob and download
    const blob = new Blob([xmlString_output], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${routeName}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error creating GPX:', error);
    throw error;
  }
}

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
