const stateMap = {
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
      html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: orange; font-size: 3em;"></i><div class="circle" 
        style="position: absolute; top: 9%; left: 14%; transform: translate(-0%, -0%); width: 13px; height: 13px; background-color: white; border-radius: 50%; border: 1px solid black; z-index: 1000;"></div></div>`,
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
        <summary>Travel to <i>${feature.properties.fullName}</i></summary>
        <p>Get Directions: <a href="https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}" target="_blank">Google Maps</a></p>
      </details>`;
  },

  attachPopupEvent: function (layer) {
    layer.on('popupopen', function () {
      const popupElement = layer.getPopup().getElement();
      popupElement.querySelector('.read-more').addEventListener('click', stateMap.expandDescription);
    });
  },

  createFeatures: function (parksData) {
    console.log('creating features and initializing map');
    if (!this.mapInitialized) {
      this.myMap = L.map("stateMap", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [this.tileLayer]
    });

      this.myMap.attributionControl.setPrefix('');
      document.querySelector('.leaflet-control-attribution').style.fontSize = '1px';

      this.mapInitialized = true;
    }

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

      stateMap.geojsonFeatures.push(geojsonFeature);
    });

    this.parks = L.geoJSON(this.geojsonFeatures, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: stateMap.createDarkGreenIcon() });
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(stateMap.createPopupContent(feature), { autoPan: true });

        stateMap.attachPopupEvent(layer);
      }
    });
  },

  updateMap: function (selectedState) {
    console.log('Updating map for state (updateMap):', selectedState);
    console.log('shouldUpdateMap set to:', stateMap.shouldUpdateMap);

    if (!stateMap.shouldUpdateMap) {
      console.log('Map update not required');
      return;
    }

    this.myMap.eachLayer(function (layer) {
      if (layer !== stateMap.tileLayer) {
        stateMap.myMap.removeLayer(layer);
      }
    });

    const selectedStateFeature = stateMap.geojsonFeatures.find(function (feature) {
      return feature.properties.stateCode === selectedState;
    });

    if (selectedStateFeature) {
      const selectedStateLayer = L.geoJSON(selectedStateFeature, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: stateMap.createDarkGreenIcon() });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(stateMap.createPopupContent(feature), { autoPan: true });

          stateMap.attachPopupEvent(layer);
        }
      });

      selectedStateLayer.addTo(stateMap.myMap);
      stateMap.parks.addData(stateMap.geojsonFeatures);
      stateMap.parks.addTo(stateMap.myMap);

      stateMap.myMap.setView(selectedStateLayer.getBounds().getCenter(), 12);

      const marker = selectedStateLayer.getLayers()[0];
      marker.fire('click');
    }
  },

  expandDescription: function () {
    const truncatedDescription = document.getElementById("truncatedDescription");
    const fullDescription = document.getElementById("fullDescription");
    truncatedDescription.style.display = "none";
    fullDescription.style.display = 'block';

    const offset = fullDescription.clientHeight;

    const currentCenter = stateMap.myMap.getCenter();
    const newCenter = stateMap.myMap.containerPointToLatLng([stateMap.myMap.getSize().x / 2, offset]);

    stateMap.myMap.panTo(newCenter);
  },

  populateDropdown: function (data) {
    console.log('Populating dropdown with data:', data);
    const stateDropdown = document.getElementById('region');
    console.log('Dropdown:', stateDropdown);
    stateDropdown.innerHTML = '';

    const blankOption = document.createElement('option');
    blankOption.value = '';
    blankOption.text = '';
    stateDropdown.add(blankOption);

    // Use a Set to store unique activities
    const uniqueStates = new Set();

    data.forEach(function (park) {
      console.log('Processing park state data:', park);

      // Check if park.states is a string
      if (typeof park.states === 'string') {
        // Split the states string into an array using comma as the delimiter
        const stateArray = park.states.split(',').map(state => state.trim());
        stateArray.forEach(state => uniqueStates.add(state));
      } else if (Array.isArray(park.states)) {
        // Handle the case where activities are already an array
        park.states.forEach(state => uniqueStates.add(state));
      }
    });

    // Convert the Set to an array and sort it alphabetically
    const uniqueStateArray = Array.from(uniqueStates).sort();

    // Populate the dropdown with unique activities
    uniqueStateArray.forEach(function (state) {
      const option = document.createElement('option');
      option.value = state;
      option.text = state;
      stateDropdown.add(option);
    });

    // Remove the existing event listener
    stateDropdown.removeEventListener('change', stateMap.stateDropdownChangeHandler);

    // Attach a new event listener to handle changes in the activity dropdown
    stateDropdown.addEventListener('change', stateMap.stateDropdownChangeHandler);
  },

  stateDropdownChangeHandler: function () {
    console.log('State Dropdown Changed');
    // Add any additional logic you need for activity dropdown changes here
  },
};

// Define the updateDropdownOptions function
function updateDropdownOptions(selectedDropdown, otherDropdowns) {
  // Get the selected value
  const selectedValue = selectedDropdown.value;

  // Reset other dropdowns and disable them
  otherDropdowns.forEach(function (dropdown) {
    if (dropdown) {
      // Check if the dropdown is defined
      // Clear selection
      dropdown.selectedIndex = 0;

      // Disable the entire dropdown
      dropdown.disabled = dropdown.id !== selectedDropdown;
    }
  });
}

function submitForm(event) {
  event.preventDefault();
  const selectedState = document.getElementById('region').value;

  if (!selectedState) {
    console.warn('No state selected. Skipping map update.');
    return;
  }

  console.log('Selected State (form):', selectedState);

  stateMap.shouldUpdateMap = true;
  stateMap.formSubmitted = true;

  stateMap.updateMap(selectedState);
  document.getElementById('map').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event triggered.');

  const stateForm = document.getElementById('stateForm');
  if (stateForm) {
    console.log('Found stateForm element.');
    stateForm.addEventListener('submit', submitForm);
    // Add event listener for state dropdown change
    const stateDropdown = document.getElementById('region');
    stateDropdown.addEventListener('change', function () {
      const selectedState = stateDropdown.value;
      console.log('Selected State (handler)', selectedState);
      stateMap.shouldUpdateMap = true;
      stateMap.updateMap(selectedState);
    });
  } else {
    console.error('Element with ID "stateForm" not found.');
  }

  const url = 'https://qbicletkg.github.io/parks-list-data-json-hosting/parks_list.json';

  d3.json(url)
    .then(function (data) {
      console.log('Loaded data:', data);
      stateMap.createFeatures(data);
      // Pass the activityTypeDropdown as an argument
      stateMap.populateDropdown(data, document.getElementById('region'));

      // Populate state dropdown.
      const stateDropdown = document.getElementById('region');
      const states = Array.from(new Set(data.map(park => park.states))).sort();
      states.forEach(function (state) {
        const option = document.createElement('option');
        option.value = state;
        option.text = state;
        stateDropdown.add(option);
      });
    })
    .catch(function (error) {
      console.error('Error loading data:', error);
    });
});