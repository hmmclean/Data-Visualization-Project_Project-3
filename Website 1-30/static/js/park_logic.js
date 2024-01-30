// Check if 'url' is not already declared before declaring it
if (typeof url === 'undefined') {
  // Load the url for the json data. 
  const url = 'https://qbicletkg.github.io/parks-list-data-json-hosting/parks_list.json';

  // Perform a GET request to the query URL/
  d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data);

    // Populate the dropdown with park names
    populateDropdown(data);
  });
}

// Function to create map features and convert data to GeoJSON.
function createFeatures(parksData) {
  let geojsonFeatures = [];

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

  // Function to create a dark green icon with a circle.
  function createDarkGreenIcon() {
    return L.divIcon({
      className: 'custom-icon',
      html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: darkgreen; font-size: 2em;"></i><div class="circle" 
      style="position: absolute; top: 8%; left: 9.3%; transform: translate(-0%, -0%); width: 9px; height: 8px; background-color: white; border-radius: 50%; border: 1px solid black; z-index: 1000;"></div></div>`,
      iconSize: [48, 64],  // Adjusted to maintain balance with the increased font-size
      iconAnchor: [24, 50], // Adjusted to properly position the icon in the center
      popupAnchor: [0, -42],
    });
  }

  // Create a GeoJSON layer with the features array.
  let parks = L.geoJSON(geojsonFeatures, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: createDarkGreenIcon() });
    },

    onEachFeature: function (feature, layer) {
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

      layer.on('popupopen', function () {
        const popupElement = layer.getPopup().getElement();
        popupElement.querySelector('.read-more').addEventListener('click', expandDescription);
      });
    }
  });

  // Create the map.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: []
  });

  // Tile Layer with custom attribution.
  let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(myMap);

  // Hide and style the default Leaflet attribution.
  myMap.attributionControl.setPrefix('');
  document.querySelector('.leaflet-control-attribution').style.fontSize = '1px';

  // Add the GeoJSON layer to the map.
  parks.addTo(myMap);
}

// Function to populate the dropdown with park names
function populateDropdown(data) {
  const parkDropdown = document.getElementById('parkType');

  data.forEach(function (park) {
    const option = document.createElement('option');
    option.value = park.fullName;
    option.text = park.fullName;
    parkDropdown.add(option);
  });
}

// Function to expand the description.
function expandDescription() {
  const truncatedDescription = document.getElementById("truncatedDescription");
  const fullDescription = document.getElementById("fullDescription");
  truncatedDescription.style.display = "none";
  fullDescription.style.display = "block";
}