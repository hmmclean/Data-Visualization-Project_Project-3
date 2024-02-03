// Initialize the map with an empty GeoJSON layer for markers (no markers on initialization).
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
});

// Tile Layer without attribution and logo.
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: ''
}).addTo(myMap);

// Remove the attribution control from the map
myMap.removeControl(myMap.attributionControl);

// Function to create pointer markers with dark green color.
let orangeIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: #C56C39; font-size: 3em;"></i><div class="circle" 
    style="position: absolute; top: 9%; left: 14%; transform: translate(-0%, -0%); width: 13px; height: 13px; background-color: white; border-radius: 50%; border: 1px solid #9d4d1f; box-shadow: 0px 0px 10px rgba(244, 204, 181, 0.75); z-index: 1000;"></div></div>`,
  iconSize: [48, 64],
  iconAnchor: [24, 50],
  popupAnchor: [0, -42],
});

// Function to create GeoJSON features from park data
function createGeoJSONFeatures(data) {
  return data.map(function (park) {
    return {
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
  });
}

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
  // Populate the activity dropdown with unique activity values
  const activityDropdown = document.getElementById('activityType');

  // Clear existing options in the dropdown
  activityDropdown.innerHTML = '';

  // Extract all activities from the array of parks
  const allActivities = data.flatMap(park => park.activities.split(',').map(activity => activity.trim()));

  // Extract unique activity values
  const uniqueActivities = Array.from(new Set(allActivities));

  // Sort unique activities alphabetically
  uniqueActivities.sort();

  // Populate the dropdown with sorted options
  uniqueActivities.forEach(activity => {
    const option = document.createElement('option');
    option.value = activity;
    option.textContent = activity;
    activityDropdown.appendChild(option);
  });

  // Attach event listeners to the activity dropdown
  activityDropdown.addEventListener('change', function (event) {
    submitForm(event, 'activityType');
  });

  // Set the default value of the dropdown to an empty string
  activityDropdown.value = '';

  function submitForm(event, dropdownId) {
    event.preventDefault();

    const selectedValue = document.getElementById(dropdownId).value;

    // Clear existing markers from the map
    myMap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        myMap.removeLayer(layer);
      }
    });

    if (selectedValue !== '') {
      const filteredData = data.filter(park => park.activities.includes(selectedValue));
      if (filteredData.length > 0) {
        const filteredGeojsonFeatures = createGeoJSONFeatures(filteredData);

        // Create a new GeoJSON layer with filtered features
        let filteredParks = L.geoJSON(filteredGeojsonFeatures, {
          pointToLayer: function (feature, latlng) {
            // Use the default marker but set it to the custom icon
            return L.marker(latlng, { icon: orangeIcon });
          },
          onEachFeature: function (feature, layer) {
            // Truncate description to a certain length.
            const maxDescriptionLength = 100;
            const truncatedDescription = feature.properties.description.length > maxDescriptionLength
              ? feature.properties.description.substring(0, maxDescriptionLength) + "..."
              : feature.properties.description;

            layer.bindPopup(`
              <h3 style="word-wrap: break-word; max-width: 200px;">${feature.properties.fullName}, ${feature.properties.stateCode}</h3>
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
              </details>
            `);

            // Tooltip for filtered markers
            updateTooltipContent(layer, feature);

            /// Dynamically attach click event to expand description
            layer.on('popupopen', function () {
              const popupElement = layer.getPopup().getElement();
              popupElement.querySelector('.read-more').addEventListener('click', expandDescription);
            });
          }
        });

        // Add the new GeoJSON layer to the map
        filteredParks.addTo(myMap);
      } else {
        console.log('No parks found for the selected activity');
      }
    }
  }

  // Function to expand the description.
  function expandDescription() {
    const truncatedDescription = document.getElementById("truncatedDescription");
    const fullDescription = document.getElementById("fullDescription");
    truncatedDescription.style.display = "none";
    fullDescription.style.display = "block";
  }

  // Function to update tooltip content for both initial and filtered markers
  function updateTooltipContent(layer, feature) {
    const maxDescriptionLength = 100;
    const truncatedDescription = feature.properties.description.length > maxDescriptionLength
      ? feature.properties.description.substring(0, maxDescriptionLength) + "..."
      : feature.properties.description;

    const tooltipContent = `
      <strong>${feature.properties.fullName}, ${feature.properties.stateCode}</strong><br>
      ${truncatedDescription}<br>
      <a href="#" class="read-more">Read more</a>
    `;

    layer.setTooltipContent(tooltipContent);
  }
});
