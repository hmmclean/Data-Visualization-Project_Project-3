// Encapsulate related functionality in an object
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
      html: `<div class="icon-wrapper"><i class="fas fa-map-marker" style="color: darkgreen; font-size: 3em;"></i><div class="circle" 
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
      </details>`;
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
        layer.bindPopup(ParkMap.createPopupContent(feature));

        layer.on('popupopen', function () {
          const popupElement = layer.getPopup().getElement();
          popupElement.querySelector('.read-more').addEventListener('click', ParkMap.expandDescription);
        });
      }
    });

    if (!this.mapInitialized) {
      this.myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [this.tileLayer]
      });

      this.myMap.attributionControl.setPrefix('');
      document.querySelector('.leaflet-control-attribution').style.fontSize = '1px';

      this.mapInitialized = true;
    }
  },

  updateMap: function (selectedPark) {
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
          layer.bindPopup(ParkMap.createPopupContent(feature));
        }
      });

      selectedParkLayer.addTo(ParkMap.myMap);
      ParkMap.myMap.setView(selectedParkLayer.getBounds().getCenter(), 12);

      const marker = selectedParkLayer.getLayers()[0];
      marker.fire('click');
    }
  },

  expandDescription: function () {
    const truncatedDescription = document.getElementById("truncatedDescription");
    const fullDescription = document.getElementById("fullDescription");
    truncatedDescription.style.display = "none";
    fullDescription.style.display = "block";
  },

  populateDropdown: function (data) {
    const parkDropdown = document.getElementById('parkType');
    parkDropdown.innerHTML = ''; // Clear existing options

    const blankOption = document.createElement('option');
    blankOption.value = '';
    blankOption.text = '';
    parkDropdown.add(blankOption);

    data.forEach(function (park) {
      const option = document.createElement('option');
      option.value = park.fullName;
      option.text = park.fullName;
      parkDropdown.add(option);
    });

    parkDropdown.addEventListener('change', function () {
      ParkMap.shouldUpdateMap = true;
    });
  }
};

function submitForm(event) {
  event.preventDefault();
  const selectedPark = document.getElementById('parkType').value;
  console.log('Selected Park:', selectedPark);

  ParkMap.shouldUpdateMap = true;

  ParkMap.formSubmitted = true;
  ParkMap.updateMap(selectedPark);

  document.getElementById('map-container').style.display = 'block';
}

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
