var map;
var directionsRenderer;
var directionsService;
var westLake = {
  lat: 21.053225,
  lng: 105.824852
};
var places = [
  ["Lăng chủ tịch", 21.036873, 105.834979, 4],
  ["Phủ tây hồ", 21.055928, 105.819733, 5],
  ["Thung lũng hoa", 21.074799, 105.819014, 3]
];
var markers = [];
var info = [
  '<div id="content">' +
  '<div id="siteNotice">' +
  "</div>" +
  '<h1 id="firstHeading" class="firstHeading">Lăng chủ tịch</h1>' +
  '<div id="bodyContent">' +
  '<p>Vietnamese leader Ho Chi Minh"s body is on display in this mausoleum & historic site.</p>' +
  "</div>" +
  "</div>",
  '<div id="content">' +
  '<div id="siteNotice">' +
  "</div>" +
  '<h1 id="firstHeading" class="firstHeading">Lăng chủ tịch</h1>' +
  '<div id="bodyContent">' +
  '<p>Vietnamese leader Ho Chi Minh"s body is on display in this mausoleum & historic site.</p>' +
  "</div>" +
  "</div>",
  '<div id="content">' +
  '<div id="siteNotice">' +
  "</div>" +
  '<h1 id="firstHeading" class="firstHeading">Lăng chủ tịch</h1>' +
  '<div id="bodyContent">' +
  '<p>Vietnamese leader Ho Chi Minh"s body is on display in this mausoleum & historic site.</p>' +
  "</div>" +
  "</div>"
];

// Initialize and add the map
function reloadMarkers() {
  // Loop through markers and set map to null for each
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  // Reset the markers array
  markers = [];

  // Call set markers to re-add markers
  setMarkers(places);
}
s;

function addPlace() {
  const name = document.getElementById("name").value;
  const lat = document.getElementById("latitude").value;
  const lng = document.getElementById("longitude").value;
  let content = document.getElementById("content").value;
  var myLatLng = new google.maps.LatLng(lat, lng);
  content =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">' +
    name +
    "</h1>" +
    '<div id="bodyContent">' +
    "<p>" +
    content +
    "</p>" +
    "</div>" +
    "</div>";
  const infowindow = new google.maps.InfoWindow({
    content,
    maxWidth: 300
  });
  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    animation: google.maps.Animation.DROP,
    title: name,
    zIndex: 1
  });
  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });
  marker.addListener("dblclick", function() {
    marker.setMap(null);
  });
  markers.push(marker);
}

function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  marker.addListener("dblclick", function() {
    marker.setMap(null);
  });
  markers.push(marker);
}

function setMarkers(locations) {
  for (var i = 0; i < locations.length; i++) {
    var place = locations[i];
    const infowindow = new google.maps.InfoWindow({
      content: info[i],
      maxWidth: 300
    });
    const marker = new google.maps.Marker({
      position: {
        lat: place[1],
        lng: place[2]
      },
      map: map,
      animation: google.maps.Animation.DROP,
      title: place[0],
      zIndex: place[3]
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
    marker.addListener("dblclick", function() {
      marker.setMap(null);
    });
    markers.push(marker);
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: westLake
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map
  });
  map.addListener("click", function(event) {
  	var start = event.latLng;
    map.addListener
    addMarker(event.latLng);
    console.log(event.latLng)
  });

  setMarkers(places);
  // The marker, positioned at Uluru
  var geocoder = new google.maps.Geocoder();

  directionsRenderer.setMap(map);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer
    );
  };
  document
    .getElementById("start")
    .addEventListener("change", onChangeHandler);
  document
    .getElementById("end")
    .addEventListener("change", onChangeHandler);
  document
    .getElementById("mode")
    .addEventListener("change", onChangeHandler);
  document
    .getElementById("submit")
    .addEventListener("click", function() {
      geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById("address").value;
  geocoder.geocode({
      address: address
    },
    function(results, status) {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert(
          "Geocode was not successful for the following reason: " +
          status
        );
      }
    }
  );
}

function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer
) {
  directionsService.route({
      origin: {
        query: document.getElementById("start").value
      },
      destination: {
        query: document.getElementById("end").value
      },
      travelMode: "DRIVING"
    },
    function(response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert(
          "Directions request failed due to " + status
        );
      }
    }
  );
}


function calculateAndDisplayRouteWidthLatLong(directionsService, directionsRenderer, start, end) {
  directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    },
    function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}
