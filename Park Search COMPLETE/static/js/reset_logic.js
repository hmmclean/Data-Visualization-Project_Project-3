// reset_logic.js

document.addEventListener("DOMContentLoaded", function () {
  // Function to reset all dropdowns
  function resetDropdowns() {
    const parkTypeDropdown = document.getElementById('parkType');
    const activityTypeDropdown = document.getElementById('activityType');
    const regionDropdown = document.getElementById('region');

    // Reset selected index
    parkTypeDropdown.selectedIndex = 0;
    activityTypeDropdown.selectedIndex = 0;
    regionDropdown.selectedIndex = 0;

    // Enable all dropdowns
    parkTypeDropdown.disabled = false;
    activityTypeDropdown.disabled = false;
    regionDropdown.disabled = false;
  }

  // Event delegation for the reset button
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('reset-button')) {
      resetDropdowns();

      // Call the function to reset the map
      resetMap();
    }
  });

  // Function to reset the map
  function resetMap() {
    // Assuming ParkMap is the object managing your map
    if (ParkMap.mapInitialized) {
      // Remove the layers related to the last search result
      ParkMap.myMap.eachLayer(function (layer) {
        if (layer !== ParkMap.tileLayer) {
          ParkMap.myMap.removeLayer(layer);
        }
      });

      // Set the view to the initial center and zoom
      ParkMap.myMap.setView([37.09, -95.71], 4);
      
      // Add additional logic if needed to reset other map-related state
    }
  }
});
