const ParkMap = {
  tileLayer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
  }),

  parks: null,
  geojsonFeatures: [],
  formSubmitted: false,
  shouldUpdateMap: false,
  mapInitialized: false,

  createDarkGreenIcon: function () {
    return L.divIcon({
      className: 'custom-icon',
      html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: #005300; font-size: 3em;"></i><div class="circle" 
        style="position: absolute; top: 9%; left: 14%; transform: translate(-0%, -0%); width: 13px; height: 13px; background-color: white; border-radius: 50%; border: 1px solid #184f18; box-shadow: 0px 0px 12px rgba(2, 230, 2, .5); z-index: 1000;"></div></div>`,
      iconSize: [48, 64],
      iconAnchor: [24, 50],
      popupAnchor: [0, -42],
    });
  },

  createPopupContent: function (feature) {
    const maxDescriptionLength = 100;
    const truncatedDescription = feature.properties.description.length > maxDescriptionLength
      ? feature.properties.description.substring(0, maxDescriptionLength) + "..."
      : feature.properties.description;
  
    return `<h3>${feature.properties.fullName}, ${feature.properties.stateCode}</h3>
      <hr>
      <div id="truncatedDescription">
        <p>${truncatedDescription}
        <a href="#" class="read-more">Read more</a></p>
      <hr>
      </div>
      <div id="fullDescription" style="display:none;">
        <p>${feature.properties.description}</p>
      <hr>
      </div>
      <br>
      <details>
        <summary>View Park Website</summary>
        <p>Website: <a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
      </details>
      <details>
        <summary>View Park Activities</summary>
        <p>Activities: ${feature.properties.activities}</p>
      </details>
      <details>
        <summary>Travel to <a href="#" class="set-end-address">${feature.properties.fullName}</a></summary>
        <p>Get Directions: <a href="https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}" target="_blank">Google Maps</a></p>
      </details>`;
  },

  attachPopupEvent: function (layer) {
    layer.on('popupopen', function () {
      const popupElement = layer.getPopup().getElement();
      popupElement.querySelector('.read-more').addEventListener('click', ParkMap.expandDescription);
        
      // Input fields for link-defined addresses
      const endAddressInput = document.getElementById('endAddress');

      // Function to toggle visibility of user-defined addresses input box
      function toggleUserInputBox(show) {
        const userInputBox = document.getElementById('userInputBox');
        userInputBox.style.display = show ? 'block' : 'none';
      }
      // Event listener for "Set as end address" link in popup.
      popupElement.querySelector('.set-end-address').addEventListener('click', function () {
        // Show the user input box when the link is clicked
        toggleUserInputBox(true);
    
        // Set the end address input value
        const parkName = layer.feature.properties.fullName;
        endAddressInput.value = parkName

        // Run the getDirections function when the link is clicked.
        getDirections(true)
    
        // Close the popup after setting the end address
        layer.closePopup();
      });
    });
  },

  createFeatures: function (parksData) {
    this.geojsonFeatures = [];

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

      ParkMap.geojsonFeatures.push(geojsonFeature);
    });

    this.parks = L.geoJSON(this.geojsonFeatures, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: ParkMap.createDarkGreenIcon() });
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(ParkMap.createPopupContent(feature), { autoPan: true });

        ParkMap.attachPopupEvent(layer);
      }
    });

    if (!this.mapInitialized) {
      this.myMap = L.map("map", {
        center: [50.0, -100],
        zoom: 3,
        layers: [this.tileLayer]
      });

      this.myMap.attributionControl.setPrefix('');
      document.querySelector('.leaflet-control-attribution').style.fontSize = '1px';

      this.mapInitialized = true;
    }
  },

  updateMap: function (selectedPark, callback) {
    if (!ParkMap.shouldUpdateMap) {
      return;
    }

    this.myMap.eachLayer(function (layer) {
      if (layer !== ParkMap.tileLayer) {
        ParkMap.myMap.removeLayer(layer);
      }
    });

    const selectedParkFeature = ParkMap.geojsonFeatures.find(function (feature) {
      return feature.properties.fullName === selectedPark;
    });

    if (selectedParkFeature) {
      const selectedParkLayer = L.geoJSON(selectedParkFeature, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: ParkMap.createDarkGreenIcon() });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(ParkMap.createPopupContent(feature), { autoPan: true });

          ParkMap.attachPopupEvent(layer);
        }
      });

      selectedParkLayer.addTo(ParkMap.myMap);

      // Manually adjust the view to the center of the selected park's layer
      ParkMap.myMap.setView(selectedParkLayer.getBounds().getCenter(), 12);

      // Trigger a click event on the marker to open the popup
      const marker = selectedParkLayer.getLayers()[0];
      marker.fire('click');

      // Run selected park layer through get directions function.
      getDirections(selectedParkLayer)
    }
  },

  expandDescription: function () {
    const truncatedDescription = document.getElementById("truncatedDescription");
    const fullDescription = document.getElementById("fullDescription");
    truncatedDescription.style.display = "none";
    fullDescription.style.display = "block";
  
    // Calculate the offset to move the map down by the expanded description's height
    const offset = fullDescription.clientHeight;
  
    // Get the current map center and adjust it vertically
    const currentCenter = ParkMap.myMap.getCenter();
    const mapContainer = ParkMap.myMap.getContainer();

    // Use the map container dimensions to calculate the new center.
    const newCenter = ParkMap.myMap.containerPointToLatLng([mapContainer.clientWidth / 2, offset]);
  
    // Pan the map to the new center
    ParkMap.myMap.panTo(newCenter);
  },

  populateDropdown: function (data) {
    const parkDropdown = document.getElementById('parkType');
    parkDropdown.innerHTML = ''; // Clear existing options

    data.forEach(function (park) {
      const option = document.createElement('option');
      option.value = park.fullName;
      option.text = park.fullName;
      parkDropdown.appendChild(option);
    });

    // Set the default value of the dropdown to an empty string
    parkDropdown.value = '';
    
    parkDropdown.addEventListener('change', function () {
      ParkMap.shouldUpdateMap = true;
    });
  }
};

// Declare routingControl outside of createMap function.
let routingControl;

// Function to get directions.
function getDirections() {

  // Input fields for user-defined addresses
  const startAddressInput = document.getElementById('startAddress');
  const endAddressInput = document.getElementById('endAddress');

  // Button to set user-defined start and end locations
  const setLocationsButton = document.getElementById('setLocationsButton');
  setLocationsButton.addEventListener('click', function () {
    const startAddress = startAddressInput.value.trim();
    const endAddress = endAddressInput.value.trim();

  if (startAddress && endAddress) {
    geocodeAddress(startAddress, function (startLatLng) {
      geocodeAddress(endAddress, function (endLatLng) {
        routingControl.setWaypoints([startLatLng, endLatLng]);
      });
    });
  } else {
    alert('Please enter both starting and destination addresses.');
  }
  });

  // Geocode an address and execute a callback with the resulting LatLng
  function geocodeAddress(address, callback) {
    L.Control.Geocoder.nominatim().geocode(address, function (results) {
      if (results.length > 0) {
        const location = results[0].center;
        const latLng = L.latLng(location.lat, location.lng);
        callback(latLng);
      } else {
        alert('Unable to geocode the address: ' + address);
      }
    });
  }

  // Add the routing control
  routingControl = L.Routing.control({
    waypoints: [],  // Set waypoints dynamically based on user input
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    router: new L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1'
    })
  }).addTo(ParkMap);
  
  // Call updateMap with getDirections as a callback
  ParkMap.updateMap(selectedPark, getDirections);
}

// Define the submitForm function
function submitForm(event) {
  event.preventDefault();
  const selectedPark = document.getElementById('parkType').value;

  if (selectedPark === '') {
    // Handle the case where the user didn't select a park
    alert('Please select a park from the dropdown.');
    return;
  }

  ParkMap.shouldUpdateMap = true;

  ParkMap.formSubmitted = true;
  ParkMap.updateMap(selectedPark);

  document.getElementById('map-container').style.display = 'block';
}

// Set the default value of the dropdown to the default placeholder
document.getElementById('parkType').value = '';

// Attach submitForm function to the form's submit event
document.addEventListener('DOMContentLoaded', function () {
  const parkForm = document.getElementById('parkForm');
  if (parkForm) {
    parkForm.addEventListener('submit', submitForm);
  } else {
    console.error('Element with ID "parkForm" not found.');
  }

  const url = 'https://qbicletkg.github.io/parks-list-data-json-hosting/parks_list.json';

  d3.json(url)
    .then(function (data) {
      ParkMap.createFeatures(data);
      ParkMap.populateDropdown(data);
    })
    .catch(function (error) {
      console.error('Error loading data:', error);
    });
});

