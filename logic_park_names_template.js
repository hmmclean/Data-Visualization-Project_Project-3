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
    let geojsonFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [park.longitude, park.latitude]
      },
      properties: {
        fullName: park.fullName,
        stateCode: park.states,
        description: park.description,
        activities: park.activities,
        url: park.url
      }
    };

    geojsonFeatures.push(geojsonFeature);
  });

  // Function to create pointer markers with dark green color.
  let greenIcon = L.divIcon({
      className: 'custom-icon',
      html: '<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: darkgreen; font-size: 2em"></i><div class="circle"><div><div>',
      iconSize: [48, 64],
      iconAnchor: [24, 50],
      popupAnchor: [0, -42]
    });
  
  // Create a GeoJSON layer with the features array.
  let parks = L.geoJSON(geojsonFeatures, {
    pointToLayer: function (feature, latlng) {
      // use the default marker but set to green.
      return L.marker(latlng, {icon: greenIcon});
    },

    onEachFeature: function (feature, layer) {
       // Truncate description to a certain length.
      const maxDescriptionLength = 100;
      const truncatedDescription = feature.properties.description.length > maxDescriptionLength
        ? feature.properties.description.substring(0, maxDescriptionLength) + "..."
        : feature.properties.description;

        layer.bindPopup(`<h3>${feature.properties.fullName}, ${feature.properties.stateCode}</h3>
        <hr>
        <p id="truncatedDescription">${truncatedDescription}<a href="#" class="read-more">Read more</a></p>
        <hr>
        <div id="fullDescription" style="display:none;">${feature.properties.description}</div>
        <details>
          <summary>View Park Website</summary>
          <p>Website: <a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
        </details>
        <details>
          <summary>View Park Activities</summary>
          <p>Activities: ${feature.properties.activities}</p>
        </details>
        <details>
          <summary>Travel to <i>${feature.properties.fullName}</i></summary>
          <p>Get Directions: <a href="https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}" target="_blank">Google Maps</a></p>
        </details>
        `);
  
        // Attach click event dynamically after the popup is opened.
        layer.on('popupopen',function (){
                  const popupElement = layer.getPopup().getElement();
                  popupElement.querySelector('.read-more').addEventListener('click', expandDescription);
        });
      }
    });
  
    // Function to expand the description.
    function expandDescription() {
      const truncatedDescription = document.getElementById("truncatedDescription");
      const fullDescription = document.getElementById("fullDescription");
      truncatedDescription.style.display = "none";
      fullDescription.style.display = "block";
    }

  // Send our GeoJSON layer to the createMap function.
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

  // Add the parks GeoJSON layer to the map.
  parks.addTo(myMap)

}