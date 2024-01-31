// park_init.js

const parkApplication = parkApplication || {};

// Check if ParkMap is already defined
if (!parkApplication.parkMap) {
  // Define ParkMap only if it doesn't exist
  parkApplication.ParkMap = {
    // ... your ParkMap properties and methods
  };
}

parkApplication.submitForm = function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the selected value from the dropdown
  const selectedPark = document.getElementById('parkType').value;

  // Log the selected value (you can replace this with your form submission logic)
  console.log('Selected Park:', selectedPark);

  // Update the map based on the selected park
  if (parkApplication.ParkMap) {
    parkApplication.ParkMap.updateMap(selectedPark);
  } else {
    console.error('ParkMap is not defined. Make sure park_map.js is included before park_init.js.');
  }
};

// Rest of the code...
document.addEventListener('DOMContentLoaded', function () {
  const parkForm = document.getElementById('parkForm');
  if (parkForm) {
    parkForm.addEventListener('submit', parkApplication.submitForm);
  } else {
    console.error('Element with ID "parkForm" not found.');
  }

  // Disable the unused dropdowns
  function updateDropdownOptions(selectedDropdown, otherDropdowns) {
    // Get the selected value
    const selectedValue = selectedDropdown.value;

    // Reset other dropdowns and disable them
    otherDropdowns.forEach(function (dropdown) {
      // Clear selection
      dropdown.selectedIndex = 0;

      // Disable the entire dropdown
      dropdown.disabled = dropdown.id !== selectedDropdown.id;
    });
  }

  // Get references to the dropdowns
  const parkTypeDropdown = document.getElementById('parkType');
  const activityTypeDropdown = document.getElementById('activityType');
  const regionDropdown = document.getElementById('region');

  // Attach event listeners to each dropdown
  parkTypeDropdown.addEventListener('change', function () {
    updateDropdownOptions(parkTypeDropdown, [activityTypeDropdown, regionDropdown]);
  });

  activityTypeDropdown.addEventListener('change', function () {
    updateDropdownOptions(activityTypeDropdown, [parkTypeDropdown, regionDropdown]);
  });

  regionDropdown.addEventListener('change', function () {
    updateDropdownOptions(regionDropdown, [parkTypeDropdown, activityTypeDropdown]);
  });
});
