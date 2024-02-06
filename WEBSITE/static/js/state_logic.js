// Initialize the map with an empty GeoJSON layer for markers (no markers on initialization).
let myMap = L.map("map", {
  center: [50, -100],
  zoom: 3,
});

// Tile Layer without attribution and logo.
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: ''
}).addTo(myMap);

// Remove the attribution control from the map
myMap.removeControl(myMap.attributionControl);

// Function to create pointer markers with teal color.
let orangeIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: #008199; font-size: 3em;"></i><div class="circle" 
    style="position: absolute; top: 9%; left: 14%; transform: translate(-0%, -0%); width: 13px; height: 13px; background-color: white; border-radius: 50%; border: 1px solid #2d6974; box-shadow: 0px 0px 5px rgba(6, 196, 231, .7); z-index: 1000;"></div></div>`,
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
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data);
  });
  
  function createFeatures(stateData) {
    const stateDropdown = document.getElementById('stateType');
  
    // Define your custom order for states
    const customStateOrder = [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'DC', name: 'District of Columbia' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
      { code: 'AS', name: 'American Samoa' },
      { code: 'GU', name: 'Guam' },
      { code: 'MP', name: 'Northern Mariana Islands' },
      { code: 'PR', name: 'Puerto Rico' },
      { code: 'VI', name: 'Virgin Islands' },
    ];
  
      // Use a Set to track unique state codes
    const uniqueStateCodes = new Set();
  
    // Iterate through the stateData and add unique state codes to the Set
    stateData.forEach(park => {
      const stateCodes = park.states.split(',');
  
      stateCodes.forEach(stateCode => {
        uniqueStateCodes.add(stateCode.trim());
      });
    });
  
// Create an empty array to store unique full names
const uniqueFullNames = [];

// Iterate through the custom state order
customStateOrder.forEach(stateObj => {
  const stateName = stateObj.name;
  // Check if an option with the current state name already exists in the array
  if (!uniqueFullNames.includes(stateName) && uniqueStateCodes.has(stateObj.code)) {
    // If not, add the full name to the array
    uniqueFullNames.push(stateName);
  }
});

// Populate the dropdown with unique full names
uniqueFullNames.forEach(stateName => {
  const option = document.createElement('option');
  option.value = stateName;
  option.textContent = stateName; // Use full name for the option text
  stateDropdown.appendChild(option);
});

  // Attach event listeners to the state dropdown
   stateDropdown.addEventListener('change', function (event) {
    submitForm(event, 'stateType');
  });

  // Set the default value of the dropdown to an empty string
  stateDropdown.value = '';

  function submitForm(event, dropdownId) {
    event.preventDefault();
  
    const selectedFullName = document.getElementById(dropdownId).value;
  
    // Find the corresponding state code for the selected full name
    const selectedStateCode = customStateOrder.find(stateObj => stateObj.name === selectedFullName)?.code;
  
    // Clear existing markers from the map
    myMap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        myMap.removeLayer(layer);
      }
    });
  
    if (selectedStateCode) {
      const filteredData = stateData.filter(park => park.states.includes(selectedStateCode));
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
              popupElement.querySelector('.read-more').addEventListener('click', expandDescription.bind(layer)); // Use bind to pass the layer as 'this'
            });
          }
        });

        // Add the new GeoJSON layer to the map
      filteredParks.addTo(myMap);

      // Calculate the bounds of the markers
      const markerBounds = filteredParks.getBounds();

      // Zoom the map to fit the marker bounds with a slight zoom out
      myMap.fitBounds(markerBounds, { padding: [10, 10], animate: true, duration: 10 });
    } else {
      console.log('No parks found for the selected state');
    }
  }
}

function expandDescription() {
  const truncatedDescription = document.getElementById("truncatedDescription");
  const fullDescription = document.getElementById("fullDescription");
  truncatedDescription.style.display = "none";
  fullDescription.style.display = "block";

  // Get the marker's latitude and longitude from the popup's feature
  const latLng = this._popup._source.getLatLng();

  // Calculate the new target position with a slight offset (e.g., 0.1 degrees)
  const newLatLng = L.latLng(latLng.lat + 2, latLng.lng);

  // Pan the map to the new target location
  myMap.panTo(newLatLng);
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
};
