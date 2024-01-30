// Load the url for the json data. 
const url = 'https://qbicletkg.github.io/parks-list-data-json-hosting/parks_list.json'

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data);
});

// Function to create map features and convert data to geojson.
function createFeatures(parksData) {
  
  let geojsonFeatures = []

  parksData.forEach(function (park) {
    // Once state code is ready comment back in the below:
    // // Parse the addresses JSON-like string into a JavaScript object
    // const addresses = JSON.parse(park.addresses);

    // // Find the stateCode from the first address (assuming it's present in all addresses)
    // const stateCode = addresses.length > 0 ? addresses[0].stateCode : '';
    
    // add in marker color to green

    let geojsonFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [park.longitude, park.latitude]
      },
      properties: {
        fullName: park.fullName,
        //stateCode: stateCode,
        description: park.description,
        activities: park.activities,
        url: park.url
      }
    };

    geojsonFeatures.push(geojsonFeature);
  });
  
  // Create a GeoJSON layer with the features array
  // Add a link to open street maps (pulls in lat and lon) 
  // Collapsable description?
  let parks = L.geoJSON(geojsonFeatures, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.fullName}</h3>
      <hr>
      <p>${feature.properties.description}</p>
      <p>${feature.properties.url}<p>
      `);
    }
  });

  // Send our GeoJSON layer to the createMap function
  createMap(parks);
}

// Function to create map.
function createMap(parks) {
  
  // Create our map.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: []
  });

  // Tile Layer with custom attribution.
  let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(myMap);

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": tileLayer,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Parks: parks
  };

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}