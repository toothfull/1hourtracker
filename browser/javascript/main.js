//Global variables
let marker
let newPos
let map
let userLine
let username

//Function for initialising the map
function initMap() {

	// The location of Paris
	const paris = {lat: 48.8566, lng: 2.3522};

	// The map, centered at Paris
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: paris,
	});

	// Adds marker position at Paris
	marker = new google.maps.Marker({
		position: paris,
		map: map,
	});

	// Adds user line
	line = new google.maps.Polyline({
		strokeColor: "#000000",
		strokeOpacity: 1.0,
		strokeWeight: 3,
 	});
	line.setMap(map);

	let infoWindow = new google.maps.InfoWindow();

	// Open the InfoWindow on mouseover:
	google.maps.event.addListener(line, 'mouseover', function() {
		infoWindow.setPosition(newPos);
		infoWindow.setContent(username + ' is on the move!');
		infoWindow.open(map);
	});
	
	// Close the InfoWindow on mouseout:
	google.maps.event.addListener(line, 'mouseout', function() {
		infoWindow.close();
	});

}	

function liveMarker(lat, long) {
	newPos = new google.maps.LatLng(lat, long)
	marker.setPosition( newPos );
	map.panTo( newPos );
	map.setZoom(18)

	
	
}

function updateLine (lat, long) {
	var path = line.getPath();
	path.push(new google.maps.LatLng(lat, long));
}

//function for counting down an hour
function countDown() {

	var countDownDate = new Date().getTime() + 3600000;

	// Update the count down every 1 second
	var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("stopwatch").innerHTML = minutes + "m " + seconds + "s ";
    
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("stopwatch").innerHTML = "EXPIRED";
    }
}, 1000);
}

function getLocation() {
	if (navigator.geolocation) {
		(navigator.geolocation.getCurrentPosition(function(position){
			console.log(position.coords.latitude, position.coords.longitude);
			liveMarker(position.coords.latitude, position.coords.longitude);
			updateLine(position.coords.latitude, position.coords.longitude);
			setTimeout(getLocation, 1000);
		})); 
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

$('#submit').click(() => {

	username = validation($('#username').val());

	if (username == false) {
		alert('Username is not valid');
		$('#username').val('');
	}
	else {
		$.post( "http://localhost:1000/username", { username: username }, function (data){
			alert(data);
		});
		$('#username').val('');
		initMap();
	}

	getLocation();

});

window.onload = function() {
	initMap();
}