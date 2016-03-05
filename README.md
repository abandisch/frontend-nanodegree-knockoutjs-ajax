# Project 5-1: Neighborhood Map Project

This is the fifth project for the Udacity Front-End Web Developer nanodegree submitted by Alexander Bandisch.

The purpose of this project is to develop a single-page application featuring a map with predefined locations. The application should use KnockoutJS to update the DOM, and ajax requests using API's to provide additional information on each location.
    
The map I chose to display is a map of Australia and each listed location is the capital city of each state. The map features custom markers showing each listed location on the map. When a user clicks on a marker (or a city in the side bar), an info window opens up and ajax requests are sent off to the APIs at panoramio.com and wikipedia.org, fetching an image of the selected city and information relating to the selected city, respectively. Once the information is retrieved from the APIs, the info window is populated with the information.         

## Included files



## Installation

Source files are located under the `src` directory and the production files, including all optimized images, are located under the `dist` directory. 

To edit the source files, you'll need Grunt installed globally, then run under the root directory (where package.json is located), run the following on the command line:
```sh
$ npm install
```
Then to watch for changes, run `grunt` from the command line:
```sh
$ grunt
```



