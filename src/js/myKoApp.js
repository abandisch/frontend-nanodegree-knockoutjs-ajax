
// Function to handle the situation when the Google Map API load succeeds
function googleMapSuccess() {

    // Adds isOpen variable to the Google Map InfoWindow - this is used to track the state of the infowindow, i.e. if it's open (true) or not (false)
    google.maps.InfoWindow.prototype.isOpen = false;

    // List of custom locations on the map: These are the capital cities of each state of Australia
    var myLocationList = [
        { name: 'Adelaide, South Australia', coordinates: { lat: -34.950335, lng: 138.585695 } },
        { name: 'Brisbane, Queensland', coordinates: { lat: -27.473427, lng: 153.015955 } },
        { name: 'Canberra, Australian Capital Territory', coordinates: { lat: -35.311149, lng: 149.141226 } },
        { name: 'Darwin, Northern Territory', coordinates: { lat: -12.522223, lng: 130.786914 } },
        { name: 'Hobart, Tasmania', coordinates: { lat: -42.911797, lng: 147.294396 } },
        { name: 'Melbourne, Victoria', coordinates: { lat: -37.804358, lng: 144.949998 } },
        { name: 'Perth, Western Australia', coordinates: { lat: -31.957453, lng: 115.837902 } },
        { name: 'Sydney, New South Wales', coordinates: { lat: -33.890328, lng: 151.199303 } },
    ];

    var mapOptions = {
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.HYBRID
                ]
            }
        },
        map = new google.maps.Map(document.getElementById("map"), mapOptions),
        mapBounds = new google.maps.LatLngBounds();

    ko.applyBindings(new myViewModel(map, myLocationList, mapBounds));

}

// Function to handle the situation when the Google Map API load fails
function googleMapError() {
    if(confirm('Sorry, but I cannot load the Google Map API. Please confirm you have access to http://maps.googleapis.com, and then press OK to try again.')){
        window.location.reload();
    }
}
