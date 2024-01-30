// Constants
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Map Initialization
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Tile Layer with custom attribution
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(myMap);

// Hide and style the default Leaflet attribution
myMap.attributionControl.setPrefix('');
document.querySelector('.leaflet-control-attribution').style.fontSize = '0px';

// // Function to Get Color based on Depth
// function getColor(depth) {
//   return depth > 90 ? '#8B0000' :
//          depth > 70 ? '#B22222' :
//          depth > 50 ? '#FF8C00' :
//          depth > 30 ? '#FFD700' :
//          depth > 10 ? '#ADFF2F' :
//          '#00FF00';  
// }

// // Function to Create Pointer Markers with Dark Green Color
// function createPointerMarker(geometry, properties) {
//   const { place, mag, time, url } = properties;
//   const date = new Date(time).toLocaleDateString("en-US");

//   const darkGreenIcon = L.divIcon({
//     className: 'custom-icon',
//     html: '<i class="fas fa-map-marker" style="color: darkgreen;"></i>',
//     iconSize: [30, 42],
//     iconAnchor: [15, 42],
//     popupAnchor: [0, -42]
//   });

//   const pointerMarker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], { icon: darkGreenIcon })
//     .bindPopup(`
//       <h1>${place}</h1>
//       <hr>
//       <h3>Magnitude: ${mag}</h3>
//       <h4>Date: ${date}</h4>
//       <a href="${url}" target="_blank">Event Details</a>
//     `);

//   return pointerMarker;
// }

// // Fetch and Process Earthquake Data
// const fetchData = () => {
//   return d3.json(url)
//     .then(({ features }) => {
//       console.log('Fetched earthquake data:', features);
//       features
//         .filter(({ properties }) => properties.mag !== null && !isNaN(properties.mag) && properties.mag >= 0.001)
//         .forEach(({ geometry, properties }) => createPointerMarker(geometry, properties).addTo(myMap));
//     })
//     .catch(error => {
//       console.error('Error fetching earthquake data:', error);
//       // Handle the error as needed
//     });
// };

// Initial Fetch
fetchData();

// Periodic Refresh (adjust the interval as needed)
setInterval(() => {
  // Remove existing markers before fetching new data
  myMap.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      myMap.removeLayer(layer);
    }
  });

  // Fetch and process new data
  fetchData();
}, 300000);  // 5 minutes interval
