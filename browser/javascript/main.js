//Global variables
let map // the google map
let marker // marker of where CURRENT user is
let lineForCurrentUser // line on map for CURRENT user
let infoWindow // window for displaying text
let newPos // position of where the marker is
let username // name of CURRENT user
let distance = 1 // time until stopwatch ends
let hasStarted = false // have we started the session yet?
let lineColour = randomColor() // random color for the CURRENT user's line


//Function for initialising the map
function initMap() {
	console.log( 'initMap() called' )

	//console.log(lineColour)

	// The map, centered on the user
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 18,
		center: {lat: 50.4351, lng: -3.5642}
	});

	// Adds marker position on the user
	marker = new google.maps.Marker({
		position: { lat: 50.4351, lng: -3.5642},
		map: map,
	});

	navigator.geolocation.getCurrentPosition(function(position){
		const initialUserPosition = new google.maps.LatLng( position.coords.latitude, position.coords.longitude)
		map.panTo(initialUserPosition)
		marker.setPosition(initialUserPosition)
	})

	// Adds user line
	lineForCurrentUser = new google.maps.Polyline({
		strokeColor: lineColour,
		strokeOpacity: 1.0,
		strokeWeight: 6,
	});
	lineForCurrentUser.setMap(map);
	console.log( 'made line for current user' )

	infoWindow = new google.maps.InfoWindow();

	// Open the InfoWindow on mouseover:
	google.maps.event.addListener(lineForCurrentUser, 'mouseover', function() {
		infoWindow.setPosition(newPos);
		infoWindow.setContent(username + ' is on the move!');
		infoWindow.open(map);
	});
	
	// Close the InfoWindow on mouseout:
	google.maps.event.addListener(lineForCurrentUser, 'mouseout', function() {
		infoWindow.close();
	});

	console.log( 'setup infoWindow' )

}

//random hex color generator
function randomColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function liveMarker(lat, long) {
	console.log( 'liveMarker() called' )
	newPos = new google.maps.LatLng(lat, long)
	marker.setPosition( newPos );
	map.setZoom(18)
}

function updateLine(lat, long) {
	console.log( 'updateLine() called' )
	var path = lineForCurrentUser.getPath();
	path.push(new google.maps.LatLng(lat, long));
	console.log( path )
}

//function for counting down an hour
function countDown() {

	var countDownDate = new Date().getTime() + 3600000;

	// Update the count down every 1 second
	var x = setInterval(function() {

		// Get todays date and time
		var now = new Date().getTime();
		
		// Find the distance between now an the count down date
		distance = countDownDate - now;
		
		// Time calculations for days, hours, minutes and seconds
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		// Output the result in an element with id="demo"
		document.getElementById("stopwatch").innerHTML = minutes + "m " + seconds + "s ";
		
		// If the count down is over, write some text 
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("stopwatch").innerHTML = "EXPIRED";
			hasStarted = false;
		}

	}, 1000);
}

function getLocation(usernameID) {
	if (navigator.geolocation) {
		(navigator.geolocation.getCurrentPosition(function(position){
			map.panTo( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) );
			//Timer reaches 0

			if (distance > 0) {
				liveMarker(position.coords.latitude, position.coords.longitude);
				updateLine(position.coords.latitude, position.coords.longitude);
				updateServer(usernameID, position.coords.latitude, position.coords.longitude, lineColour)
				setTimeout(function(){
					getLocation(usernameID);
				}, 60000);
			}
		})); 
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function updateServer (usernameID, lat, long, lineColour) {
	const data = {
		usernameID: usernameID,
		lat: lat,
		long: long,
		lineColour: lineColour,
		timeStamp: new Date().getTime()
	}	
	webSocket.send ( JSON.stringify(data) );
};

function renderUserOffline (){
	$.get("http://localhost:1000/offlineUsers", (data) => {
		//console.dir(data)

		for (let i = 0; i < data.length; i++){
			let user = data[i]
			//console.log(user)

			var lineForOfflineUser = new google.maps.Polyline({
				strokeColor: user.lineColour,
				strokeOpacity: 1.0,
				strokeWeight: 6,
			});
			lineForOfflineUser.setMap(map);

			
			let locationArray = user.locations
			locationArray.sort((a,b) =>{
				return a.timeStamp - b.timeStamp
			})

			var path = lineForOfflineUser.getPath();
			for (let j = 0; j < locationArray.length; j++) {
				path.push(new google.maps.LatLng(locationArray[j].lat, locationArray[j].long));
			}

			let lastpos = new google.maps.LatLng(locationArray[locationArray.length - 1].lat, locationArray[locationArray.length - 1].long)

			// Open the InfoWindow on mouseover:
			google.maps.event.addListener(lineForOfflineUser, 'mouseover', function() {
				infoWindow.setPosition(lastpos);
				infoWindow.setContent(user.username + ' has taken a rest here!');
				infoWindow.open(map);
			});
			
			// Close the InfoWindow on mouseout:
			google.maps.event.addListener(lineForOfflineUser, 'mouseout', function() {
				infoWindow.close();
			});

		}
	})
}

$('#submit').click(() => {
	if (hasStarted == false) {
		hasStarted = true;

		username = validation($('#username').val());

		if (username == false) {
			alert('Username is not valid');
			$('#username').val('');
			
		}
		else {
			$.post( "http://localhost:1000/username", { username: username, lineColour: lineColour }, function (data){
				connectToWebsocket( username );
			});

			$('#username').val('');			
		}
	} 
	else {
		alert('You have already a session');
	}

});

$('#myLocation').click(() => {
	navigator.geolocation.getCurrentPosition(function(position){
		map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
		marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
	})
	
});

window.onload = function() {
	initMap();
	renderUserOffline();
}
