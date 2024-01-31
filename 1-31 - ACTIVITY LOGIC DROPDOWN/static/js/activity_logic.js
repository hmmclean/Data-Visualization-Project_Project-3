const ActivityMap = {
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
      popupElement.querySelector('.read-more').addEventListener('click', ActivityMap.expandDescription);
    });
  },

  createFeatures: function (parksData) {
    if (!this.mapInitialized) {
      this.myMap = L.map("activityMap", {
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

      ActivityMap.geojsonFeatures.push(geojsonFeature);
    });

    this.parks = L.geoJSON(this.geojsonFeatures, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: ActivityMap.createDarkGreenIcon() });
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(ActivityMap.createPopupContent(feature), { autoPan: true });

        ActivityMap.attachPopupEvent(layer);
      }
    });
  },

  updateMap: function (selectedPark) {
    if (!ActivityMap.shouldUpdateMap) {
      return;
    }

    this.myMap.eachLayer(function (layer) {
      if (layer !== ActivityMap.tileLayer) {
        ActivityMap.myMap.removeLayer(layer);
      }
    });

    const selectedParkFeature = ActivityMap.geojsonFeatures.find(function (feature) {
      return feature.properties.fullName === selectedPark;
    });

    if (selectedParkFeature) {
      const selectedParkLayer = L.geoJSON(selectedParkFeature, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: ActivityMap.createDarkGreenIcon() });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(ActivityMap.createPopupContent(feature), { autoPan: true });

          ActivityMap.attachPopupEvent(layer);
        }
      });

      selectedParkLayer.addTo(ActivityMap.myMap);

      ActivityMap.myMap.setView(selectedParkLayer.getBounds().getCenter(), 12);

      const marker = selectedParkLayer.getLayers()[0];
      marker.fire('click');
    }
  },

  expandDescription: function () {
    const truncatedDescription = document.getElementById("truncatedDescription");
    const fullDescription = document.getElementById("fullDescription");
    truncatedDescription.style.display = "none";
    fullDescription.style.display = 'block';

    const offset = fullDescription.clientHeight;

    const currentCenter = ActivityMap.myMap.getCenter();
    const newCenter = ActivityMap.myMap.containerPointToLatLng([ActivityMap.myMap.getSize().x / 2, offset]);

    ActivityMap.myMap.panTo(newCenter);
  },

  populateDropdown: function (data, activityTypeDropdown, regionDropdown) {
    console.log('Populating dropdown with data:', data);
    const activityDropdown = document.getElementById('activityType');
    console.log('Dropdown:', activityDropdown);
    activityDropdown.innerHTML = '';
  
    const blankOption = document.createElement('option');
    blankOption.value = '';
    blankOption.text = '';
    activityDropdown.add(blankOption);
  
    // Use a Set to store unique activities
    const uniqueActivities = new Set();
  
    data.forEach(function (park) {
      console.log('Processing park data:', park);
  
      // Check if park.activities is a string
      if (typeof park.activities === 'string') {
        // Split the activities string into an array using comma as the delimiter
        const activitiesArray = park.activities.split(',').map(activity => activity.trim());
        activitiesArray.forEach(activity => uniqueActivities.add(activity));
      } else if (Array.isArray(park.activities)) {
        // Handle the case where activities are already an array
        park.activities.forEach(activity => uniqueActivities.add(activity));
      }
    });
  
    // Convert the Set to an array
    const uniqueActivityArray = Array.from(uniqueActivities);
  
    // Populate the dropdown with unique activities
    uniqueActivityArray.forEach(function (activity) {
      const option = document.createElement('option');
      option.value = activity;
      option.text = activity;
      activityDropdown.add(option);
    });
  
    activityTypeDropdown.addEventListener('change', function () {
      console.log('Activity Dropdown Changed');
      updateDropdownOptions(activityTypeDropdown, [activityTypeDropdown, regionDropdown]);
    });
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
  const selectedPark = document.getElementById('activityType').value;

  if (!selectedPark) {
    console.warn('No park selected. Skipping map update.');
    return;
  }

  console.log('Selected Park:', selectedPark);

  ActivityMap.shouldUpdateMap = true;
  ActivityMap.formSubmitted = true;
  ActivityMap.updateMap(selectedPark);

  document.getElementById('map-container').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event triggered.');

  const activityForm = document.getElementById('activityForm');
  if (activityForm) {
    console.log('Found activityForm element.');
    activityForm.addEventListener('submit', submitForm);
  } else {
    console.error('Element with ID "activityForm" not found.');
  }

  const url = 'https://qbicletkg.github.io/parks-list-data-json-hosting/parks_list.json';

  d3.json(url)
    .then(function (data) {
      console.log('Loaded data:', data);
      ActivityMap.createFeatures(data);

      // Pass the activityTypeDropdown as an argument
      ActivityMap.populateDropdown(data, document.getElementById('activityType'));
    })
    .catch(function (error) {
      console.error('Error loading data:', error);
    });
});
