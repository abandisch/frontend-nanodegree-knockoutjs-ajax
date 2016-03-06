# Project 5-1: Neighborhood Map Project

This is the fifth project for the Udacity Front-End Web Developer nanodegree submitted by Alexander Bandisch.

The purpose of this project is to develop a single-page application featuring a map with predefined locations. The application should use KnockoutJS to update the DOM, and ajax requests using API's to provide additional information on each location.
    
The map I chose to display is a map of Australia and each listed location is the capital city of each state. The map features custom markers showing each listed location on the map. When a user clicks on a marker (or a city in the side bar), an info window opens up and ajax requests are sent off to the APIs at panoramio.com and wikipedia.org, fetching an image of the selected city and information relating to the selected city, respectively. Once the information is retrieved from the APIs, the info window is populated with the information. In addition the list can be filtered through an input box.

## How to use the application

This is a single page application that shows the locations of the capital city of each of the states in Australia. Clicking on a marker on the map will open an info window, showing an image of the city, provided by [Panoramio](http://www.panoramio.com/) and the intro text of the corresponding [Wikipedia](https://en.wikipedia.org/wiki/Main_Page) page. This information is obtained using ajax requests via the corresponding APIs. The cities listed in the side bar can be filtered using the provided textbox.

### Start the application

* To start the application, open `dist/index.html` in your browser.

### Viewing location information

* To view more information for a given location, either: 
  * Click on any given marker on the map, _or_
  * Click on a city name in the side bar

Doing one of the above will open the corresponding info window and display an image and related Wikipedia information for the selcted city. If for any reason the information cannot be retrieved from the given API, an error message will be disaplyed in the info window.

### Filtering location list

* To filter the list of locations in the side bar and map, type in the search query in the input box above the list of locations in the side bar. 

## Production and Development files

The below are the files used for Development, i.e. files located under the `src` directory
* `src/`
  * `css/`
    * `bootstrap.min.css` - minified Bootstrap CSS
    * `style.css` - custom CSS required for the application
  * `js/`
    * `jquery.min.js` - jQuery
    * `bootstrap.min.js` - Bootstrap JS
    * `underscore-min.js` - Underscore JS
    * `knockout-3.3.0.js` - Knockout JS
    * `myKoView.js` - Knockout ViewModel and Place object
    * `myapp.js` - Knockout bindings

The following are the files for Production, i.e. files located under the `dist` directory
* `dist/`
  * `css/`
    * `styles.min.css` - minified Bootstrap and custom CSS in one file
  * `images/` 
    * `ajax-loader.gif` - Ajax preloader animation GIF
    * `marker_default.png` - Default marker icon
    * `marker_active.png` - Active marker icon (indicates selected marker)
    * `panoramio-logo.png` - Logo for panoramio.com
    * `wikipedia-logo.png` - Logo for wikipedia.org
  * `js/`
    * `app.min.js` - jQuery, Bootstrap JS, knockout JS, underscore JS and custom app JS

Other files
* `gruntfile.js` - Grunt configuration file
* `package.json` - Used by NPM to install the required grunt plugins

## Setting up the development environment

The application works out of the box by opening `dist/index.html` in the browser, however to make changes to the source code, located under the `src` directory you'll need [Grunt](http://gruntjs.com/getting-started) installed globally. Once Grunt is installed, navigate to the root directory (where package.json is located), and then run the following on the command line to install the required Grunt plugins:
```sh
$ npm install
```
Then to watch for development changes under the `src` directory and automatically complie and output the changes to the `dist` directory, run `grunt` from the command line:
```sh
$ grunt
```



