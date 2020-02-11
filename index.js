var map;
var flightPath;
var poly;
var rectangle;
var westLake = {
  lat: 21.053225,
  lng: 105.824852
};
var arrayRegion = [];
var arrayMarker = [];
var listenerStart;
var listenerEnd;
var end, start;
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
};

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
    zoom: 15,
    center: westLake
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map
  });
  map.addListener("click", function(event) {
    addMarker(event.latLng);
  });
  /*   map.addListener("click", function(event) {
      var start = event.latLng;
      map.addListener
      addMarker(event.latLng);
      console.log(event.latLng)
    }); */

  setMarkers(places);
  // The marker, positioned at Uluru
  var geocoder = new google.maps.Geocoder();

  directionsRenderer.setMap(map);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer,
      start,
      end
    );
  };
  document
    .getElementById("mode")
    .addEventListener("change", onChangeHandler);
  document
    .getElementById("submit")
    .addEventListener("click", function() {
      geocodeAddress(geocoder, map);
    });

  document
    .getElementById("findPlace")
    .addEventListener("click", function() {
      getOrigin(geocoder);
    });
    
      document
    .getElementById("getWay")
    .addEventListener("click", function() {
      getWay(directionsService, directionsRenderer);
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

function calculateAndDisplayRoute(directionsService, directionsRenerer, start, end) {

  var selectedMode = document.getElementById('mode').value;
  directionsService.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode[selectedMode]
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
  var selectedMode = document.getElementById('mode').value;
  console.log("selectedMode 1: ", selectedMode);
  directionsService.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode[selectedMode]
    },
    function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

function drawingThePathWithLatLong(LatLongArray, map) {
  flightPath = new google.maps.Polyline({
    path: LatLongArray,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}

function drawPath() {

  const arrayPath = [{
      lat: 21.065165775817963,
      lng: 105.81094518341807
    },
    {
      lat: 21.063844205500114,
      lng: 105.81051602997569
    },
    {
      lat: 21.062202238144547,
      lng: 105.81038728394297
    },
    {
      lat: 21.061441320298368,
      lng: 105.8097435537794
    },
    {
      lat: 21.060119716895393,
      lng: 105.81021562256602
    },
    {
      lat: 21.059599082028736,
      lng: 105.80909982361582
    },
    {
      lat: 21.058477708436413,
      lng: 105.80832734741954
    },
    {
      lat: 21.05610745280827,
      lng: 105.80893993377686
    },
    {
      lat: 21.054713035287897,
      lng: 105.81185652806397
    },
    {
      lat: 21.05210974816378,
      lng: 105.81297232701417
    },
    {
      lat: 21.049466363883713,
      lng: 105.8141310413086
    },
    {
      lat: 21.046943089650547,
      lng: 105.81494643284913
    },
    {
      lat: 21.043859029739146,
      lng: 105.82228495671387
    },
    {
      lat: 21.0431781247875,
      lng: 105.82520320012208
    },
    {
      lat: 21.04177625184902,
      lng: 105.82679106785889
    },
    {
      lat: 21.043017911405258,
      lng: 105.83000971867676
    },
    {
      lat: 21.04301057715023,
      lng: 105.83619117736816
    },
    {
      lat: 21.04301057715023,
      lng: 105.83619117736816
    },
    {
      lat: 21.04386794163166,
      lng: 105.83112551762696
    },
    {
      lat: 21.04551011125506,
      lng: 105.83614661290284
    },
    {
      lat: 21.04867424068251,
      lng: 105.83764864995118
    },
    {
      lat: 21.050516614182772,
      lng: 105.83842112614747
    },
    {
      lat: 21.054879694412165,
      lng: 105.83544490396609
    },
    {
      lat: 21.05828392044201,
      lng: 105.83368537485232
    },
    {
      lat: 21.05793571137976,
      lng: 105.82899269978182
    },
    {
      lat: 21.05785561265093,
      lng: 105.82508740345614
    },
    {
      lat: 21.054691678377534,
      lng: 105.82113919178622
    },
    {
      lat: 21.055052129980837,
      lng: 105.81933674732821
    },
    {
      lat: 21.05857649965837,
      lng: 105.81834969441073
    },
    {
      lat: 21.06254131577169,
      lng: 105.81998047749178
    },
    {
      lat: 21.065481045567076,
      lng: 105.82193717364477
    },
    {
      lat: 21.065719105330245,
      lng: 105.82310199737549
    },
    {
      lat: 21.065719105330245,
      lng: 105.82310199737549
    },
    {
      lat: 21.06836442484887,
      lng: 105.82125994019773
    },
    {
      lat: 21.071207702457308,
      lng: 105.82173200898436
    },
    {
      lat: 21.073530339597635,
      lng: 105.81971498780516
    },
    {
      lat: 21.071888479170596,
      lng: 105.81683965974119
    },
    {
      lat: 21.072288934604902,
      lng: 105.81538053803709
    },
    {
      lat: 21.070406784686895,
      lng: 105.81366392426756
    },
    {
      lat: 21.06736325782172,
      lng: 105.8122477179077
    }
  ]
  drawingThePathWithLatLong(arrayPath, map);
}

function removePath(input) {
  input.setMap(null);
  var length = arrayMarker.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      arrayMarker[i].setMap(null);
    }
  }
}

function addLatLng(event) {
  var path = poly.getPath();
  path.push(event.latLng);
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: '#' + path.getLength(),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    },
    draggable: true,
    map: map
  });

  arrayMarker.push(marker);
}

function drawPathWithHand() {
  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
  poly.setMap(map);
  map.addListener('click', addLatLng);
}

function getLatLng(event) {
  var lat = event.latLng.lat();
  var lng = event.latLng.lng();
  // var place_id = event.latLng().place_id;
  // console.log("place_id: ", place_id);
  var objectLatLng = {
    lat: lat,
    lng: lng
  }
  console.log("objectLatLng: ", objectLatLng);
  arrayRegion.push(objectLatLng)
  console.log("arrayRegion: ", arrayRegion);
}

function makeRegion() {
  map.addListener('click', getLatLng);
}

function drawRectangle() {

  var bounds = {
    north: 21.3,
    south: 20.6,
    east: 106.004,
    west: 105.44
  };

  // Define a rectangle and set its editable property to true.
  rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true,
  });
  rectangle.setMap(map);

  rectangle.addListener('drag', function() {
    console.log("rectangle: ", rectangle);
  });

}

function getWay(directionsService, directionsRenderer) {
  const origin = document.getElementById("start").value;
  const destination = document.getElementById("end").value;
  start = origin;
  end = destination
  calculateAndDisplayRouteWidthLatLong(directionsService, directionsRenderer, start, end)
}

function getOrigin(geocoder) {
  listenerStart = map.addListener("click", function(event) {
    getOriginLatLng(event.latLng, geocoder)
  })
}

function getOriginLatLng(location, geocoder) {
/*   geocoder.geocode({
    'location': location
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        document.getElementById("start").value = results[1].place_id
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  }); */
  start = location;
  document.getElementById('start').value = start;

  google.maps.event.removeListener(listenerStart);
  listenerEnd = map.addListener("click", function(event) {
    getDestinationLatLng(event.latLng, geocoder)
  })
}

function getDestinationLatLng(location, geocoder) {
  /* geocoder.geocode({
    'location': location
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        document.getElementById("end").value = results[1].place_id;
        google.maps.event.removeListener(listenerEnd);
        getWay();
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  }); */
  end = location;
  document.getElementById('end').value = end;
  google.maps.event.removeListener(listenerEnd);
  calculateAndDisplayRouteWidthLatLong(directionsService, directionsRenderer, start, end)
}
