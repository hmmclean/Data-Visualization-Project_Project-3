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

  // Iterate through the custom state order
  customStateOrder.forEach(stateObj => {
    const stateCode = stateObj.code;
    // Check if an option with the current state code already exists in the dropdown
    if (!stateDropdown.querySelector(`option[value="${stateCode}"]`) && uniqueStateCodes.has(stateCode)) {
      // If not, create a new option and append it to the dropdown
      const option = document.createElement('option');
      option.value = stateCode;
      option.textContent = stateObj.name; // Use the name property for the option text
      stateDropdown.appendChild(option);
    }
  });
  



  // Function to create pointer markers with teal color.
  let orangeIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: #008199; font-size: 3em;"></i><div class="circle" 
      style="position: absolute; top: 9%; left: 14%; transform: translate(-0%, -0%); width: 13px; height: 13px; background-color: white; border-radius: 50%; border: 1px solid #2d6974; box-shadow: 0px 0px 5px rgba(6, 196, 231, .7); z-index: 1000;"></div></div>`,
    iconSize: [48, 64],
    iconAnchor: [24, 50],
    popupAnchor: [0, -42],
  });

  // Create a GeoJSON layer with the features array.
  let parks = L.geoJSON(createGeoJSONFeatures(stateData), {
    pointToLayer: function (feature, latlng) {
      // Use the default marker but set it to orange.
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

      // Tooltip for initial markers
      const tooltipContent = `
        <strong>${feature.properties.fullName}, ${feature.properties.stateCode}</strong><br>
        ${truncatedDescription}<br>
        <a href="#" class="read-more">Read more</a>
      `;

      layer.bindTooltip(tooltipContent);

      // Attach click event dynamically after the popup is opened.
      layer.on('popupopen', function () {
        const popupElement = layer.getPopup().getElement();
        popupElement.querySelector('.read-more').addEventListener('click', expandDescription);
      });
    }
  });

  // Create our map.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: []
  });

  // Tile Layer without attribution and logo.
  let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: ''
  }).addTo(myMap);

  // Remove the attribution control from the map
  myMap.removeControl(myMap.attributionControl);

  // Add the parks GeoJSON layer to the map.
  parks.addTo(myMap);

  // Attach event listeners to the state dropdown
stateDropdown.addEventListener('change', function (event) {
  submitForm(event, 'stateType');
});

// Define the submitForm function
function submitForm(event, dropdownId) {
  event.preventDefault();

  const selectedValue = document.getElementById(dropdownId).value;
  console.log('Selected State Code:', selectedValue);  // Log the selected state code

  // Log the stateData to check if it contains the necessary information
  console.log('stateData:', stateData);

  const filteredData = filterDataByState(selectedValue);

  if (filteredData.length > 0) {
      updateMapWithFilteredData(filteredData);
  } else {
      console.log('No parks found for the selected state');
  }
}

function filterDataByState(stateCode) {
  // Trim spaces from the selected state code
  const trimmedStateCode = stateCode.trim().toUpperCase();  // Convert to uppercase

  // Convert the state codes in the data to uppercase for consistency
  const uppercasedStateData = stateData.map(park => {
      return {
          ...park,
          states: park.states.toUpperCase()
      };
  });

  // Log the uppercase state codes for debugging
  console.log('Uppercased State Codes in Data:', uppercasedStateData.map(park => park.states));

  // Filter the data by state code
  const filteredData = uppercasedStateData.filter(park => park.states.includes(trimmedStateCode));

  console.log('Selected State Code:', trimmedStateCode);  // Log the trimmed state code
  console.log('Filtered Data:', filteredData);  // Log the filtered data

  return filteredData;
}


  function updateMapWithFilteredData(filteredData) {
      // Clear existing markers from the map
      myMap.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          myMap.removeLayer(layer);
        }
      });
    
      // Create new GeoJSON features with filtered data
      const filteredGeojsonFeatures = createGeoJSONFeatures(filteredData);
    
      // Create a new GeoJSON layer with filtered features
      let filteredParks = L.geoJSON(filteredGeojsonFeatures, {
        pointToLayer: function (feature, latlng) {
          // Use the default marker but set to the custom icon
          return L.marker(latlng, { icon: orangeIcon });
        },
        onEachFeature: function (feature, layer) {
          // Truncate description to a certain length.
          const maxDescriptionLength = 100;
          const truncatedDescription =
            feature.properties.description.length > maxDescriptionLength
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
          layer.on('popupopen', function (event) {
              const popupElement = event.popup.getElement();
              popupElement.addEventListener('click', function (clickEvent) {
                  const target = clickEvent.target;

                  if (target.classList.contains('read-more')) {
                      expandDescription();
                  }
              });
          });

          // Close popup on popup close
          layer.on('popupclose', function (event) {
              const popupElement = event.popup.getElement();
              popupElement.removeEventListener('click', function () {
                  const target = clickEvent.target;

          if (target.classList.contains('read-more')) {
              expandDescription();
          }
  });
});  
        }
      });
    
      // Add the new GeoJSON layer to the map
      filteredParks.addTo(myMap);
    }

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
}