# Visualizing America's State Parks
## Exploring America's Natural Wonders: A Comprehensive National Parks Website Project

[View our Website Here!](https://hmmclean.github.io/Data-Visualization-Project_Project-3/WEBSITE/index.html)

# Overview
We started with the idea of building a website to help people determine which of America’s national parks to visit. We wanted to show activities, distances, states, directions, and weather. This project aims to create a valuable resource for individuals interested in exploring and learning about the diverse national parks across the United States.

# Repo Navigation 
* Resources
    * Cleaned - CSVs of final cleaned data.
    * Data Sources - JSONs of final cleaned data. These are being hosted on a separate GitHub repo ([Activities](https://github.com/QbicleTKG/activities-data-json-hosting) and [Parks List](https://github.com/QbicleTKG/parks-list-data-json-hosting)).
    * Uncleaned - CSVs of data pulled from the NPS API.
    * NPS_API_Data_Pull - Code used to pull the data from the NPS API.
 * WEBSITE - HTML, JS, and CSS source documentation for our website. 
* Project Rubric - Text file containing the standards for our assignment.
* Data Transformation Jupyter Notebook - main code used for initial data cleaning.
* MongoApp - PyMongo Jupyter Notebook used to provide information on loading cleaned CSVs into MongoDB and JSONifying them.
* Assets - Images belonging to the repo.

# Data Extraction, Transformation, and Loading
- Below is a representation of our DTL process
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/DTLpng.png" width="650">
    </p>


## Extraction 
- We pulled 5 CSVs from the National Park Services API:
   - Activities
   - Fees and Passes
   - Park Activities
   - Parks List
   - Visitors' Centers

## Transform
- After some deliberation as a team and diving into each spreadsheet, we decided to keep only the Activities database and to merge the Fees/Passes and Parks List datasets.

## Load
- Once data cleaning was complete, the data was loaded into MongoDB and JSONified via PyMongo. We chose MongoDB due to the ease with which it can be integrated into Python/Jupyter Notebooks using PyMongo. The JSON files were hosted on separate Github repos to allow easy access to the data for website construction.
### Note! If you are attempting this project yourself given the data here, the two code lines you need to upload the cleaned CSVs are ```mongoimport --type csv -d national_parks -c parks_list --drop --headerline --file parks_list_cleaned.csv```, and ```mongoimport --type csv -d national_parks -c activities --drop --headerline --file activities.csv```.

# Website Outline
- Below is a representation of our process for filtering data and how our website logic might look.
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/filter%20logic1.png" width="900">
    </p> 
<br>
<br>
- Below is the actual representation of our filtering process
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/filter%20logic2.png" width="500">
    </p>



# Website Development

## WEBSITE Navigation 
- Once data was JSONified wireframes were created to contain the main navigation wiring, content containers, map containers, headers and footers. A main page was created as well as a main CSS for implementing color, styling and event specific handling, such as mozilla neglect. Once the main page was created other pages were created and modified to fit the page requirements. Images were created and added at this point. Once the page was built, functionality was added to populate the dropdowns, return map logic, reset the page and navigate away from the page. Other functionality was built such as background_logic.js and popup_logic.js to handle non-page specific requirements. 

* ROOT>
    * index.html - Main landing page
    * park.html - Park name search
    * activity.html - Activity search
    * State.html - State search
    * directions.html - Directions to park
    * Images Folder
       * Folder with images for the entire site
    * Static Folder
        * CSS Folder
           * Index.css - CSS styles for the index page
           * parkstyles.css - CSS styles for the parks page
           * activitystyles.css - CSS styles for the activities page
           * statestyles.css - CSS styles for the states page
           * direction_styles.css - CSS styles for the directions page
      * JS Folder
           * MAIN LOGIC FOR PAGE FUNCTIONALITY
              *  background_logic.js - Script that rotates the background of all the pages
              *  popup_logic.js - Script that handles the popup for the about portion of the page
           * view_logic.js - Script that handles the carousel for the index page
           * park_logic.js - Script that handles the dropdown, filtering and map for the park page
           * park_reset_logic.js - Script that resets the parks page back to initializaiton state
           * activity_logic.js - Script that handles the dropdown, filtering and map for the activity page
           * activity_reset_logic.js - Script that resets the activity page back to initializaiton state
           * state_logic.js - Script that handles the dropdown, filtering and map for the state page
           * state_reset_logic.js - Script that resets the state page back to initializaiton state
           * directions_logic.js - Script that handles the map for the directions page
           * directions_reset.js - Script that resets the activity page back to initializaiton state *only clears icons as the app is in dev and layers are buggy*

## WEBSITE Survey
#### Main index page
- This page is the main index of the site. The page is set up to loop through a carousel so you can pick how you want to search for the park. Additional functionality includes linking to the National Park Service through the logo and hypertext in the main navigation. The "Home", "About", and "Explore" offer links directly through this site. The home button directs you back to the index page, the about page presents a popup that talks about the project team, and the explore takes you to the directions page.
<br>
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/index.png" width="600">
    </p>
<br>
<br>
#### Parks page
- This page uses the dropdown to search alphabetically for a park. 
<br>
<br>
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/parks1.png" width="600">
    </p>
<br>
- Once you have located a park, additional information is available in the popup. A shortened description turns into a full description when you click "read more", and the carats expand to go straight to the park website, look at the park activities, and use google maps to get directions to the park.
<br>
<br>
<p align="center">
    <img src="https://github.com/hmmclean/Data-Visualization-Project_Project-3/blob/main/Assets/parks2.png" width="600">
    </p>
<br>








# References and Resources
* [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm)
* [Database system (MongoDB) for data storage](www.mongodb.com) 
* Frontend development with HTML, CSS, and JavaScript.
* Mapping libraries for map visualization and geospatial tools for distance calculations.
     * [Leaflet](https://leafletjs.com/) 
     * [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)
     * [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) 
* [ChatGPT](https://chat.openai.com/)
