# Visualizing America's State Parks
Exploring America's Natural Wonders: A Comprehensive National Parks Website Project

# Overview
We started with the idea of building a website to help people determine which of America’s national parks to visit. We wanted to show activities, distances, states, directions, and weather. This project aims to create a valuable resource for individuals interested in exploring and learning about the diverse national parks across the United States.


# Data Extraction, Transformation, and Loading
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/139186713/e6bf7a5a-0747-47d2-8ecd-e06c2d637cae)

## Extraction 
- We pulled 6 CSVs from the National Park Services API:
   - Activities
   - Fees and Passes
   - Park Activities
   - Parks List
   - Visitors' Centers

## Transform
- After some deliberation as a team and diving into each spreadsheet, we decided to keep only the Activities database and to merge the Fees/Passes and Parks List datasets.

## Load
- Once data cleaning was complete, the data was loaded into MongoDB and JSONified via PyMongo. The JSON files were hosted on separate Github repos to allow easy access to the data for website construction. 

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
* [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm)
* Database system (MongoDB) for data storage - www.mongodb.com 
* Frontend development with HTML, CSS, and JavaScript.
* Mapping libraries for map visualization and geospatial tools for distance calculations.
     * Leaflet - https://leafletjs.com/ 
     * Leaflet Routing Machine - https://www.liedman.net/leaflet-routing-machine/
     * Leaflet Control Geocoder - https://github.com/perliedman/leaflet-control-geocoder 
* ChatGPT - https://chat.openai.com/
