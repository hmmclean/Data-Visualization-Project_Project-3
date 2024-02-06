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

# Data Extraction, Transformation, and Loading
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/139186713/e6bf7a5a-0747-47d2-8ecd-e06c2d637cae){width=300}

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

# Website Design
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/139186713/d7ce8044-8f35-4573-a38b-736bf1a8455b)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/139186713/4f5b8ee5-f045-4289-96ca-d245eb293e72)




![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/004d68a4-ee24-452d-b237-10b37a6d1b93)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/c20af58c-26af-44d5-b5da-01a883e350c0)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/db2e2d33-c226-496c-8a3f-69b811038945)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/8dadd42d-6ea5-437b-b63b-067abcc8278b)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/b24df98a-029c-4f69-a797-269bcf3e6538)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/e99617e7-e85d-4572-9e77-4e9d3cf2271b)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/1125f6b2-9102-42ca-9de1-21803fdc9363)
![image](https://github.com/hmmclean/Data-Visualization-Project_Project-3/assets/145622440/2669a1eb-ff3b-43ad-9776-8879d2aefa8e)












# References and Resources
* [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm)
* [Database system (MongoDB) for data storage](www.mongodb.com) 
* Frontend development with HTML, CSS, and JavaScript.
* Mapping libraries for map visualization and geospatial tools for distance calculations.
     * [Leaflet](https://leafletjs.com/) 
     * [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)
     * [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) 
* [ChatGPT](https://chat.openai.com/)
