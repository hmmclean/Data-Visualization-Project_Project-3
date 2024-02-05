// reset_logic.js //

function resetPage() {
  // Reset the dropdown to its initial state
  const activityDropdown = document.getElementById('activityType');
  const initialDropdownValue = activityDropdown.dataset.initialValue;
  activityDropdown.selectedIndex = initialDropdownValue;

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