# Visualizing America's State Parks
Exploring America's Natural Wonders: A Comprehensive National Parks Website Project

# Overview
We started with the idea to build a website to help people determine which of America’s National Parks to visit. We wanted to show activities, distances, states, directions, and weather. This project aims to create a valuable resource for individuals interested in exploring and learning about the diverse national parks across the United States.


# Data Extraction, Transformation, and Loading
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/139186713/e6bf7a5a-0747-47d2-8ecd-e06c2d637cae)

One key data-gathering component is utilizing the National Parks Service API to fetch relevant information about national parks and retrieve data such as park names, locations, activities, and other relevant details. After collection, the data was reviewed to ensure consistency and reliability. The data was cleaned up to drop missing or inconsistent data and format the information for seamless integration into the database. DATABASE NAME HERE was chosen to store the cleaned data and create the final output for our website. Using HTML, CSS, and JavaScript, the website was designed to be user-friendly, interactive, and visually appealing while displaying various information about national parks. Creating an integrated mapping functionality to showcase national parks on a map with directions, utilizing geographical data to display parks by state, and allowing users to explore and discover fun activities within the park of their choice. The final outcome will be a fully functional website that provides users with a visually appealing and interactive experience while exploring information about USA National Parks. Users should be able to view parks on a map, filter them by state and activities, and access additional details about each park.

# Navigation - need to update!
* Resources
    * Cleaned - CSVs of final cleaned data.
    * Data Sources - jsons of final cleaned data.
    * Uncleaned - CSVs of data pulled from the NPS API.
    * NPS_API_Data_Pull - Code used to pull the data from the NPS API.
* MongoApp
* Folder - provided folder containing javascript app.
        * app - javascript file that imports the data from the JSON file and creates all the dashboards linked to the HTML file.

# References and Resources
* National Park Service API - https://www.nps.gov/subjects/developer/api-documentation.htm
* Database system (MongoDB) for data storage - www.mongodb.com 
* Frontend development with HTML, CSS, and JavaScript.
* Mapping libraries for map visualization and geospatial tools for distance calculations.
     * Leaflet - https://leafletjs.com/ 
     * Leaflet Routing Machine - https://www.liedman.net/leaflet-routing-machine/
     * Leaflet Control Geocoder - https://github.com/perliedman/leaflet-control-geocoder 
* ChatGPT - https://chat.openai.com/
