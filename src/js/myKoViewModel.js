// Place object - stores and tracks all details of the Place and its corresponding marker and infowindow
function Place(data) {
    var self = this;

    // The name of the Place
    self.name = data.name;

    // The latitude and longitude of the Place
    self.coordinates = data.coordinates;

    // Google map Marker
    self.marker = null;

    // Google map Marker infowindow
    self.infowindow = null;

    // Knockout.js observable used to indicate if this Place is marked as selected (i.e. with the 'selected-item' CSS class) in the side bar
    self.selected = ko.observable(false);

    // Knockout JS bindings for the Panoramio elements on the infowindow
    self.showPanoramioLoader = ko.observable(true);     // Determines if Panoramio preloader is shown or not
    self.showPanoramioInfo = ko.observable(false);      // Determines if Panoramio info section is shown or not
    self.showPanoramioError = ko.observable(false);     // Determines if Panoramio error is shown or not
    self.panoramioImageSource = ko.observable('');      // Panoramio image - contains the image obtained from the ajax request

    // Knockout JS bindings for the Wikipedia elements on the infowindow
    self.showWikipediaLoader = ko.observable(true);     // Determines if Wikipedia preloader is shown or not
    self.showWikipediaInfo = ko.observable(false);      // Determines if Wikipedia info section is shown or not
    self.wikipediaCityIntro = ko.observable('');        // Wikipedia intro text obtained from ajax request
    self.wikipediaCityLink = ko.observable('');         // Wikipedia hyperlink obtained from ajax request
    self.showWikipediaError = ko.observable(false);     // Determines if Wikipedia preloader is shown or not

    // Creates a new Google map marker and sets it to the Place objects's marker variable
    self.createMarker = function(markerOptions) {
        self.marker = new google.maps.Marker(markerOptions);
    };

    // Creates a new Google map marker infowindow with the default contents obtained from the #infowindowTemplate template
    // and sets it to the Place objects's infowindow variable
    self.createInfowindow = function() {
        self.infowindow = new google.maps.InfoWindow({
            content: document.getElementById("infowindowTemplate")
        });
        self.infowindow.isOpen = false;
    };

    // Function to close the infowindow:
    // - Closes this Place objects infowindow
    // - Removes the bounce animation of the marker
    // - Sets the selected observable to false (so it's no longer highlighted in the side bar)
    // - Resets the marker icon to the default
    // - Set the custom infowindow's isOpen variable to false
    self.closeInfowindow = function() {
        if (self.infowindow.isOpen) {
            $('body').append(self.infowindow.getContent());
            self.marker.setAnimation(null);
            self.infowindow.close();
            self.selected(false);
            self.marker.setIcon('images/marker_default.png');
            self.infowindow.isOpen = false;
            self.showPanoramioLoader(true);
            self.panoramioImageSource('');
        }
    };

    // panoramio.com ajax request
    self.panoramioAjaxRequest = function() {

        // Through experimentation, I found that it's best to search just for 'City Name, Australia',
        // to get an appropriate image of the city, hence this variable ...
        // except for Hobart, this requires the state name as well top bring back proper results...
        var city_name = (self.name.split(", ")[0] !== "Hobart" ? self.name.split(", ")[0] : self.name);

        // Sets a timeout for 8 seconds, which will show the panoramio.com error message in the infowindow,
        // in case we can't retrieve the image through the ajax request after that period of time
        var panoramioRequestTimeout = setTimeout(function() {
            self.showPanoramioError(true);
        }, 8000);

        // panoramio.com API endpoint
        var panoramioAPI = 'http://www.panoramio.com/wapi/data/get_photos?v=1';

        // panoramio.com ajax request
        $.ajax({
            url: panoramioAPI,
            type: "GET",
            dataType: "jsonp",
            data: {
                'tag': city_name + ', Australia'
            },
            success: function(data) {
                var image_src = data.photos[0].photoPixelsUrls[0].url;      // The API returns an array of images, so just get the source of the first one

                self.showPanoramioInfo(true);           // Set the showPanoramioInfo knockout JS observable to true so the Panoramio Info section is displayed
                self.panoramioImageSource(image_src);   // Set the panoramioImageSource knockout JS observable to the value obtained from the API request

                clearTimeout(panoramioRequestTimeout);  // Ajax request was successful, no need to show the error, so clear the timeout (panoramioRequestTimeout)
            },
            error: function() {
                self.showPanoramioError(true);          // In case there was an error caught by the ajax request, call showPanoramioError to show the error in the infowindow
            },
            complete: function() {
                self.showPanoramioLoader(false);        // set showPanoramioLoader to false to remove the preloader GIF
            }
        });
    };

    // wikipedia.org ajax request
    self.wikiAjaxRequest = function() {

        // Through experimentation, I found that teh Wikipedia API will return the correct results for each city, except Darwin - for this city, I need to specify the state too
        var city_name = (self.name.split(", ")[0] !== "Darwin" ? self.name.split(", ")[0] : self.name);

        // Sets a timeout for 8 seconds, which will show the wikipedia.org error message in the infowindow,
        // in case we can't retrieve the info through the ajax request after that period of time
        var wikiRequestTimeout = setTimeout(function() {
            self.showWikipediaError(true);
        }, 8000);

        // wikipedia.org API endpoint
        var wikipediaAPI = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=1&namespace=0&utf8=1&search=' + city_name;

        $.ajax({
            url: wikipediaAPI,
            dataType: 'jsonp',
            success: function(data) {
                var wiki_intro = data[2][0],    // Text about the city
                    wiki_link = data[3][0];     // Link to the wikipedia.org page for the city

                self.showWikipediaInfo(true);           // Set showWikipediaInfo to show the Wikipedia info section
                self.wikipediaCityIntro(wiki_intro);    // Set wikipediaCityIntro to the value obtained by the API request
                self.wikipediaCityLink(wiki_link);      // Set wikipediaCityLink to the value obtained by the API request

                // Clear the wikiRequestTimeout timeout, so the error message doesn't show
                clearTimeout(wikiRequestTimeout);
            },
            error: function() {
                self.showWikipediaError(true);          // In case there was an error caught by the ajax request, call showWikiError to show the error in the infowindow
            },
            complete: function() {
                self.showWikipediaLoader(false);        // set showPanoramioLoader to false to remove the preloader GIF
            }
        });
    };

}

var myViewModel = function(map, locationList, mapBounds) {
    var self = this;

    // ViewModel Data

    // Knockout JS observable for the selected Place - used to populate the infowindow information
    self.selectedPlace = ko.observable();

    // Show menu - boolean to indicate if the menu should be shown.
    self.showMenu = ko.observable(false);

    // Google maps data
    self.googleMap = map;       // The google map
    self.allPlaces = [];        // Array to store all the Places objects

    // Iterate through the provided locations, create a new Place object, and add that object to the allPlaces array
    locationList.forEach(function(place) {
        self.allPlaces.push(new Place(place));
    });

    // Iterate through each Place object and do the following
    //    - Create a Google map marker for the Place
    //    - Create a Google map marker infowindow for the Place
    //    - Add a 'click' listener event for the marker, which will either open or close the infowindow
    //    - Add a 'closeclick' listener event for the infowindow, which will close the infowindow
    //    - Extend the map boundaries to include the marker and center the map according to the boudaries of all added markers
    self.allPlaces.forEach(function(place) {

        // Marker options, which include:
        //   - The google map
        //   - The coordinates for the marker
        //   - The animation to use when the marker is placed on the map, i.e. drop
        //   - A custom marker - Marker icon obtained from: http://www.iconarchive.com/show/vista-map-markers-icons-by-icons-land/Map-Marker-Marker-Outside-Azure-icon.html
        var markerOptions = {
            map: self.googleMap,
            position: place.coordinates,
            animation: google.maps.Animation.DROP,
            icon: 'images/marker_default.png'
        };

        // Create the marker with the given options
        place.createMarker(markerOptions);

        // Create the infowindow and set the initial contents
        place.createInfowindow();

        // Add a 'click' event listener for the marker to open or close the infowindow
        place.marker.addListener('click', function() {
            self.selectedPlace(place);
            self.openOrCloseMarkerInfowindow(place);
        });

        // Add a 'clickclose' event listener for the infowindow to close the ifowindow
        place.infowindow.addListener('closeclick', function() {
            place.closeInfowindow();
        });

        // Extend/fit the bounds of the map with the new place.coordinates and then center the map within those bounds
        mapBounds.extend(new google.maps.LatLng(place.coordinates));
        self.googleMap.fitBounds(mapBounds);
        self.googleMap.setCenter(mapBounds.getCenter());

    });

    // Observable array to store all the visible Place objects
    self.visiblePlaces = ko.observableArray([]);

    // Initially populate the visiblePlaces array with all the Place objects, so they can be shown on the map
    self.allPlaces.forEach(function(place) {
        self.visiblePlaces.push(place);
    });

    // Observable to hold the filter query (to filter the cities in the sidebar)
    self.filterQuery = ko.observable('');

    // ViewModel Behaviour

    // Make the map fit on the screen when the user resizes the window
    window.onresize = function() {
        self.googleMap.fitBounds(mapBounds);
    };

    // Toggle the showMenu observable when the user clicks the menu icon
    self.toggleShowMenu = function() {
        self.showMenu(!self.showMenu());
    };

    // Function to reset all visible markers and close their corresponding infowindows
    self.resetAllVisibleMarkers = function() {
        self.visiblePlaces().forEach(function(place) {
            place.closeInfowindow();
        });
    };

    // Function to open or close the infowindow of a place.
    // If it's opening, then ajax requests to panoramio.com and wikipedia.com will be sent to
    // request information for the Place
    self.openOrCloseMarkerInfowindow = function(place) {
        if (place.infowindow.isOpen) {                              // If this Place has it's infowindow open, close it.
            place.closeInfowindow();
        } else {                                                    // Otherwise, do the following:
            self.resetAllVisibleMarkers();                          //  - Reset/close all visible markers and their infowindows
            self.showMenu(false);                                   //  - Set showMenu observable to false, so the sidebar closes
            place.marker.setAnimation(google.maps.Animation.BOUNCE);//  - Bounce the marker
            place.marker.setIcon('images/marker_active.png');       //  - Change the marker icon - Marker icon obtained from:: http://www.iconarchive.com/show/vista-map-markers-icons-by-icons-land/Map-Marker-Marker-Outside-Pink-icon.html
            place.infowindow.open(self.googleMap, place.marker);    //  - Open the infowindow
            place.infowindow.isOpen = true;                         //  - Set a variable tracking the infowindow open state
            place.selected(true);                                   //  - Update the selected observable to true, so it's highlighted in the side bar
            place.panoramioAjaxRequest();                           //  - Send off the ajax request to panoramio.com
            place.wikiAjaxRequest();                                //  - Send off the ajax request to wikipedia.org
        }
    };

    // Function referenced by the knockout.js 'click' event setup in the city listing of the sidebar.
    // It will call the openOrCloseMarkerInfowindow function and pass it the clicked Place object, which
    // will then open or close the infowindow/change the icon of the given Place object
    self.menuItemPlaceClicked = function(clicked_place) {
        self.selectedPlace(clicked_place);
        self.openOrCloseMarkerInfowindow(clicked_place);
    };

    // Function to filter markers on the map and cities in the side bar using filter input field
    self.filteredItems = ko.computed(function() {

        // Value of the filterQuery observable is set by Knockout.js when the user enters in text in the input - get that value and change the case to lowercase for easier comparison
        var filter = self.filterQuery().toLowerCase();

        if (!filter) {                                          // If no text has been specified in the input box
            self.visiblePlaces.removeAll();                     // Clear the visiblePlaces array
            self.allPlaces.forEach(function(place) {            // Remove all existing markers on the map and re-add the Place objects to the visiblePlaces array
                place.marker.setMap(null);
                self.visiblePlaces.push(place);
            });
            self.visiblePlaces().forEach(function(place) {      // Iterate through the visiblePlaces array and re-add the markers to the map
                place.marker.setMap(self.googleMap);
            });
        } else {                                                // If a search term was entered by the user
            return ko.utils.arrayFilter(self.visiblePlaces(), function(place) {
                self.resetAllVisibleMarkers();                  // Reset all visible markers and close their corresponding infowindows
                self.visiblePlaces.removeAll();                 // Clear the visiblePlaces array

                self.allPlaces.forEach(function(place) {        // Iterate through all Place objects
                    place.marker.setMap(null);                  // Remove the Place object's marker from the map
                    if (place.name.toLowerCase().indexOf(filter) !== -1) {  // Check to see if the city name matches the filter query
                        self.visiblePlaces.push(place);         // If it does, add the Place object to the visiblePlaces array
                    }
                });

                self.visiblePlaces().forEach(function(place) {  // Iterate through the visiblePlaces array
                    place.marker.setMap(self.googleMap);        // Add the Place object's marker to the map
                    place.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce the Place object's marker
                });
            });
        }
    }, self);

};