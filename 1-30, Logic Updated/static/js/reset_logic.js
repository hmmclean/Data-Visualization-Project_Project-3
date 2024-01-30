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
  
    // Event listener for the reset button
    document.querySelector('.reset-button').addEventListener('click', function () {
      resetDropdowns();
    });
  });
  