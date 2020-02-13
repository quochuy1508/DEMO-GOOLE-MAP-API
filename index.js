var map;
var flightPath;
var poly;
var rectangle;
var pathDraw = [];
var westLake = {
	lat: 21.053225,
	lng: 105.824852
};
var arrayRegion = [];
var arrayMarker = [];
var end, start;
var places = [
	["Lăng chủ tịch", 21.036873, 105.834979, 4],
	["Phủ tây hồ", 21.055928, 105.819733, 5],
	["Thung lũng hoa", 21.074799, 105.819014, 3]
];
var markers = [];
var tipObj = [null, null, null];
var offset = { x: -50, y: -65 };
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
			zIndex: place[3],
			icon:
				"http://satlodbscl.phongchongthientai.vn/Images/Customers/map/dbnguyhiemda.png"
		});
		const index = i;
		const currentPlace = place[0];
		let mouseOverEvent = marker.addListener("mouseover", function(e) {
			injectTooltip(e, currentPlace, index);
		});
		marker.addListener("mousemove", function(e) {
			moveTooltip(e, index);
		});
		marker.addListener("mouseout", function(e) {
			deleteTooltip(e, index);
		});
		marker.addListener("click", function(e) {
			infowindow.open(map, marker);
			google.maps.event.removeListener(mouseOverEvent);
			deleteTooltip(e, index);
		});
		infowindow.addListener("closeclick", function(e) {
			mouseOverEvent = marker.addListener("mouseover", function(e) {
				injectTooltip(e, currentPlace, index);
			});
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
	// map.addListener("click", function(event) {
	// 	addMarker(event.latLng);
	// });
	/*   map.addListener("click", function(event) {
      var start = event.latLng;
      map.addListener
      addMarker(event.latLng);
      console.log(event.latLng)
    }); */

	setMarkers(places);
	// The marker, positioned at Uluru
	var geocoder = new google.maps.Geocoder();
	let checkSlideSea = false;
	let checkSlideRiver = false;
	let checkBox;
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(document.getElementById("direction-panel"));

	var onChangeHandler = function() {
		calculateAndDisplayRoute(
			directionsService,
			directionsRenderer,
			start,
			end
		);
	};
	document.getElementById("mode").addEventListener("change", onChangeHandler);

	document.getElementById("findPlace").addEventListener("click", function() {
		getOrigin(geocoder);
	});

	document.getElementById("getWay").addEventListener("click", function() {
		getWay(directionsService, directionsRenderer);
	});
	document.getElementById("map-type").addEventListener("change", function() {
		let type = document.getElementById("map-type").value;
		map.setMapTypeId(type);
	});
	document.getElementById("sea").addEventListener("click", function() {
		checkBox = document.getElementById("sea");
		console.log("checkBox.checked: ", checkBox.checked);
		if (checkBox.checked === true) {
			let checkSlideSea = true;
			drawLandslide(checkSlideSea, checkSlideRiver, map);
		} else {
			hidenLandslide();
		}
	});

	document.getElementById("river").addEventListener("click", function() {
		checkBox = document.getElementById("river");
		console.log("checkBox.checked: ", checkBox.checked);
		if (checkBox.checked === true) {
			let checkSlideRiver = true;
			drawLandslide(checkSlideSea, checkSlideRiver, map);
		} else {
			hidenLandslide();
		}
	});
}

function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById("address").value;
	geocoder.geocode(
		{
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
	directionsRenerer,
	start,
	end
) {
	var selectedMode = document.getElementById("mode").value;
	directionsService.route(
		{
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode[selectedMode]
		},
		function(response, status) {
			if (status === "OK") {
				directionsRenderer.setDirections(response);
			} else {
				window.alert("Directions request failed due to " + status);
			}
		}
	);
}

function calculateAndDisplayRouteWidthLatLong(
	directionsService,
	directionsRenderer,
	start,
	end
) {
	var selectedMode = document.getElementById("mode").value;
	console.log("selectedMode 1: ", selectedMode);
	directionsService.route(
		{
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode[selectedMode]
		},
		function(response, status) {
			if (status === "OK") {
				directionsRenderer.setDirections(response);
			} else {
				window.alert("Directions request failed due to " + status);
			}
		}
	);
}

function drawingThePathWithLatLong(LatLongArray, map) {
	flightPath = new google.maps.Polyline({
		path: LatLongArray,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathDraw.push(flightPath);
	flightPath.setMap(map);
}

function drawPath() {
	const arrayPath = [
		{
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
	];
	drawingThePathWithLatLong(arrayPath, map);
}

function removePath(input) {
	input.setMap(null);
	var length = arrayMarker.length;
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
		title: "#" + path.getLength(),
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
		strokeColor: "#000000",
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	poly.setMap(map);
	map.addListener("click", addLatLng);
}

function getLatLng(event) {
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();
	// var place_id = event.latLng().place_id;
	// console.log("place_id: ", place_id);
	var objectLatLng = {
		lat: lat,
		lng: lng
	};
	console.log("objectLatLng: ", objectLatLng);
	arrayRegion.push(objectLatLng);
	console.log("arrayRegion: ", arrayRegion);
}

function makeRegion() {
	map.addListener("click", getLatLng);
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
		draggable: true
	});
	rectangle.setMap(map);

	rectangle.addListener("drag", function() {
		console.log("rectangle: ", rectangle);
	});
}

function getWay(directionsService, directionsRenderer) {
	const origin = document.getElementById("start").value;
	const destination = document.getElementById("end").value;
	start = origin;
	end = destination;
	calculateAndDisplayRouteWidthLatLong(
		directionsService,
		directionsRenderer,
		start,
		end
	);
}

function getOrigin(geocoder) {
	google.maps.event.addListenerOnce(map, "click", function(event) {
		console.log(map.getBounds());
		getOriginLatLng(event.latLng, geocoder);
	});
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
	google.maps.event.addListenerOnce(map, "click", function(event) {
		getDestinationLatLng(event.latLng, geocoder);
	});
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
	calculateAndDisplayRouteWidthLatLong(
		directionsService,
		directionsRenderer,
		start,
		end
	);
}

function centerMap(index) {
	const place = places[index];
	map.setCenter({
		lat: place[1],
		lng: place[2]
	});
	map.setZoom(17);
}

function injectTooltip(event, data, index) {
	if (!tipObj[index] && event) {
		//create the tooltip object
		tipObj[index] = document.createElement("div");
		tipObj[index].style.width = "200px";
		tipObj[index].style.height = "50px";
		tipObj[index].style.background = "white";
		tipObj[index].style.borderRadius = "5px";
		tipObj[index].style.padding = "10px";
		tipObj[index].style.fontFamily = "Arial,Helvetica";
		tipObj[index].style.textAlign = "center";
		tipObj[index].style.zIndex = "0";
		tipObj[index].innerHTML = data;

		//position it
		tipObj[index].style.position = "fixed";
		tipObj[index].style.top =
			event.tb.clientY + window.scrollY + offset.y + "px";
		tipObj[index].style.left =
			event.tb.clientX + window.scrollX + offset.x + "px";
		//add it to the body
		document.body.appendChild(tipObj[index]);
		const top = event.tb.clientY + window.scrollY + offset.y;
		const left = event.tb.clientX + window.scrollX + offset.x;
		const southWest = {
			x: left - 420,
			y: top - 50
		};
		const northEast = {
			x: left - 620,
			y: top
		};
		console.log(top);
		console.log(left);
		console.log(southWest);
		console.log(northEast);
		const bounds = new google.maps.LatLngBounds(
			point2LatLng(southWest, map),
			point2LatLng(northEast, map)
		);
		if (
			!map.getBounds().contains(point2LatLng(southWest, map)) ||
			!map.getBounds().contains(point2LatLng(northEast, map))
		)
			map.panToBounds(bounds);
	}
}

function moveTooltip(event, index) {
	if (tipObj[index] && event) {
		console.log(event);
		//position it
		tipObj[index].style.top =
			event.tb.clientY + window.scrollY + offset.y + "px";
		tipObj[index].style.left =
			event.tb.clientX + window.scrollX + offset.x + "px";
	}
}

function deleteTooltip(event, index) {
	if (tipObj[index]) {
		//delete the tooltip if it exists in the DOM
		document.body.removeChild(tipObj[index]);
		tipObj[index] = null;
	}
}

function point2LatLng(point, map) {
	var topRight = map
		.getProjection()
		.fromLatLngToPoint(map.getBounds().getNorthEast());
	var bottomLeft = map
		.getProjection()
		.fromLatLngToPoint(map.getBounds().getSouthWest());
	var scale = Math.pow(2, map.getZoom());
	var worldPoint = new google.maps.Point(
		point.x / scale + bottomLeft.x,
		point.y / scale + topRight.y
	);
	return map.getProjection().fromPointToLatLng(worldPoint);
}

function showDistance() {
	let latOfA, latOfB, lngOfA, lngOfB;
	let x, y;
	const a = map.addListener("click", function(event1) {
		x = event1.latLng;
		latOfA = event1.latLng.lat();
		lngOfA = event1.latLng.lng();
		google.maps.event.removeListener(a);
		const b = map.addListener("click", function(event2) {
			y = event2.latLng;
			latOfB = event2.latLng.lat();
			lngOfB = event2.latLng.lng();
			google.maps.event.removeListener(b);
			console.log("latOfA - lngOfA = " + latOfA + "-" + lngOfA);
			console.log("latOfB - lngOfB = " + latOfB + "-" + lngOfB);

			let distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
				x,
				y
			);

			/* caculationDistanceOfTwoPoint(latOfA, lngOfA, latOfB, lngOfB); */

			console.log("distanceInMeters: ", distanceInMeters);
		});
	});
}

function drawLandslide(modeSlideSea, modeSlideRiver, map) {
	map.setMapTypeId("satellite");
	const arraySlideSea = [
		[
			{
				lat: 20.704926774918633,
				lng: 106.7628907283535
			},
			{
				lat: 20.701394097130002,
				lng: 106.75053110921287
			},
			{
				lat: 20.690795569932423,
				lng: 106.73714152181053
			},
			{
				lat: 20.684050667052677,
				lng: 106.73439493977928
			}
		],
		[
			{
				lat: 20.6150620258162,
				lng: 106.69310694415222
			},
			{
				lat: 20.609277818108197,
				lng: 106.68040400225769
			},
			{
				lat: 20.60124383199137,
				lng: 106.67319422442566
			}
			/*       {
        lat: 20.600922463737376,
        lng: 106.66289454180847
      }, */
		],
		[
			{
				lat: 20.72523945615103,
				lng: 106.79101596600033
			},
			{
				lat: 20.734551235988178,
				lng: 106.78517947918392
			},
			{
				lat: 20.748838887567352,
				lng: 106.77951465374447
			},
			{
				lat: 20.759112319699287,
				lng: 106.77659641033627
			}
		]
	];
	const arraySlideRiver = [
		[
			{ lat: 20.286822471089906, lng: 106.56004394095612 },
			{ lat: 20.284457574628053, lng: 106.56185711425019 },
			{ lat: 20.283904083011958, lng: 106.56269396346283 }
		],
		[
			{ lat: 20.304885288445917, lng: 106.5401133928097 },
			{ lat: 20.302148362394263, lng: 106.54388994310267 },
			{ lat: 20.300256635236543, lng: 106.54680818651087 },
			{ lat: 20.298445385455803, lng: 106.54921144578822 }
		],
		[
			{ lat: 20.299572437504963, lng: 106.53878292882615 },
			{ lat: 20.295507140464434, lng: 106.5424307330864 },
			{ lat: 20.29236753113212, lng: 106.54625019872361 },
			{ lat: 20.28942912117957, lng: 106.54976925695115 },
			{ lat: 20.286691922062207, lng: 106.55311665380174 }
		],
		[
			{ lat: 20.273251268005104, lng: 106.56603290310885 },
			{ lat: 20.271600731530164, lng: 106.568221585665 },
			{ lat: 20.269628116121673, lng: 106.56985236874606 },
			{ lat: 20.26910476496661, lng: 106.57049609890963 },
			{ lat: 20.266769792151273, lng: 106.57324268094088 },
			{ lat: 20.26375037865746, lng: 106.57581760159518 },
			{ lat: 20.257469810421238, lng: 106.58058120480563 }
		],
		[
			{ lat: 20.244103388912656, lng: 106.58145201255758 },
			{ lat: 20.238587077421364, lng: 106.58316862632711 },
			{ lat: 20.235647648989804, lng: 106.58437025596578 },
			{ lat: 20.230533716360945, lng: 106.58458483268697 },
			{ lat: 20.22469476871172, lng: 106.58439927412205 },
			{ lat: 20.217969640118064, lng: 106.58229642225437 }
		]
	];

	if (modeSlideSea) {
		arraySlideSea.forEach((element, index) => {
			let myMiddleLatLng;
			let marker;
			let length = Math.floor(element.length / 2);
			let image =
				"http://satlodbscl.phongchongthientai.vn/Images/Customers/map/dbnguyhiemda.png";
			if (element.length % 2 === 0) {
				let myNextLatLng = new google.maps.LatLng(
					arraySlideSea[index][length]
				);
				let myLastLatLng = new google.maps.LatLng(
					arraySlideSea[index][length - 1]
				);
				myMiddleLatLng = google.maps.geometry.spherical.interpolate(
					myLastLatLng,
					myNextLatLng,
					0.5
				);
				console.log("myMiddleLatLng: ", myMiddleLatLng);
				marker = new google.maps.Marker({
					position: myMiddleLatLng,
					map: map,
					icon: image,
					title: "Hello World!"
				});
			} else {
				myMiddleLatLng = new google.maps.LatLng(
					arraySlideSea[index][length]
				);

				marker = new google.maps.Marker({
					position: myMiddleLatLng,
					map: map,
					icon: image,
					title: "Hello World!"
				});
				marker.setMap(map);
			}
			arrayMarker.push(marker);

			drawingThePathWithLatLong(element, map);
		});
	}

	if (modeSlideRiver) {
		arraySlideRiver.forEach((element, index) => {
			let myMiddleLatLng;
			let marker;
			let length = Math.floor(element.length / 2);
			let image =
				"http://satlodbscl.phongchongthientai.vn/Images/Customers/map/binhthuong.png";
			if (element.length % 2 === 0) {
				let myNextLatLng = new google.maps.LatLng(
					arraySlideRiver[index][length]
				);
				let myLastLatLng = new google.maps.LatLng(
					arraySlideRiver[index][length - 1]
				);
				myMiddleLatLng = google.maps.geometry.spherical.interpolate(
					myLastLatLng,
					myNextLatLng,
					0.5
				);
				console.log("myMiddleLatLng: ", myMiddleLatLng);
				marker = new google.maps.Marker({
					position: myMiddleLatLng,
					map: map,
					icon: image,
					title: "Hello World!"
				});
			} else {
				myMiddleLatLng = new google.maps.LatLng(
					arraySlideRiver[index][length]
				);

				marker = new google.maps.Marker({
					position: myMiddleLatLng,
					map: map,
					icon: image,
					title: "Hello World!"
				});
				marker.setMap(map);
			}
			arrayMarker.push(marker);

			drawingThePathWithLatLong(element, map);
		});
	}
}

function hidenLandslide() {
	arrayMarker.forEach((element, index) => {
		arrayMarker[index].setMap(null);
	});
	pathDraw.forEach((element, index) => {
		pathDraw[index].setMap(null);
	});
}
