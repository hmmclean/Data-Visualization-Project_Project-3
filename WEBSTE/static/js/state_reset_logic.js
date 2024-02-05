// reset_logic.js

function resetPage() {
  // Reset the dropdown to its initial state
  const stateDropdown = document.getElementById('stateType');
  const initialDropdownValue = stateDropdown.dataset.initialValue;
  stateDropdown.selectedIndex = initialDropdownValue;

  // Clear the map layers (markers and other layers)
  clearMapLayers();

  // Reset the map view to its initial state
  myMap.setView([50.0, -100], 3);
}

function clearMapLayers() {
  // Remove all layers except the base tile layer
  const map = myMap;
  map.eachLayer(function (layer) {
    if (layer !== tileLayer) {
      map.removeLayer(layer);
    }
  });
}
