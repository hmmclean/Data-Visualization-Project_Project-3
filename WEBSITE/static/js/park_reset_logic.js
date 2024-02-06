// reset_logic.js //

document.addEventListener('DOMContentLoaded', function () {
  const parkDropdown = document.getElementById('parkType');
  const initialDropdownValue = parkDropdown.selectedIndex;

  // Save the initial state of the dropdown
  parkDropdown.dataset.initialValue = initialDropdownValue;
});

document.addEventListener('DOMContentLoaded', function () {
  const resetButton = document.querySelector('.reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Reset the dropdown to its initial state
      const parkDropdown = document.getElementById('parkType');
      const initialDropdownValue = parkDropdown.dataset.initialValue;
      parkDropdown.selectedIndex = initialDropdownValue;

      // Clear the map layers (markers and other layers)
      clearMapLayers();

      // Reset the map view to its initial state
      if (ParkMap.mapInitialized) {
        ParkMap.myMap.setView([50.0, -100], 3);
      }
    });
  }
});

function clearMapLayers() {
  // Remove all layers except the base tile layer
  const map = ParkMap.myMap;
  map.eachLayer(function (layer) {
    if (layer !== ParkMap.tileLayer) {
      map.removeLayer(layer);
    }
  });

  // Clear any marker arrays you have
  ParkMap.markers = [];
}