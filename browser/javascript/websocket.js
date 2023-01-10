let webSocket;

function connectToWebsocket ( username ) {
	let scheme = 'ws:'
	if (window.location.protocol == 'https:') {
		scheme = 'wss:'
	}
	const hostname = window.location.host
	webSocket = new WebSocket(`${scheme}//${hostname}/websocket`);
	webSocket.onopen = function () {
		console.log('Connected to websocket');
		webSocket.send(username);
		
	}
	webSocket.onmessage = function (event) {
		console.log(event.data + ' received');
		//console.dir(users)

		// try parse as json
		let users
		try {
			users = JSON.parse(event.data.toString())

		// failed, must be username is recieved
		} catch {
			const usernameID = event.data;
			countDown();
			getLocation(usernameID);
		}

		// if location update is recieved
		if (users){
			console.log( 'we received a location update for all users' )

			// clear all paths/lines on the map!
			for(let i = 0; i < linesForOfflineUsers.length; i++) {
				linesForOfflineUsers[i].setMap( null )
			}
			linesForOfflineUsers = []
			console.log( 'cleared all existing lines' )

			// loop through the users array, and create new paths for the users!
			for(let i = 0; i < users.length; i++)  {

				// if this user isn't the client
				if (users[i].username !== username) {

					let lineColour = '#d3d3d3'
					if (users[i].isOnline == true) {
						lineColour = users[i].lineColour
					}

					// new line
					let lineForUser = new google.maps.Polyline({
						strokeColor: lineColour,
						strokeOpacity: 1.0,
						strokeWeight: 6,
					});
					lineForUser.setMap(map);
					console.log( 'made line for:', users[i].username, ' with colour:', lineColour )

					// add line to array to be removed later
					linesForOfflineUsers.push(lineForUser)

					// get their location history and sort it
					let locationArray = users[i].locations
					locationArray.sort((a,b) =>{
						return a.timeStamp - b.timeStamp
					})

					// put the history into the path
					let path = lineForUser.getPath();
					for (let j = 0; j < locationArray.length; j++) {
						path.push(new google.maps.LatLng(locationArray[j].lat, locationArray[j].long));
					}
					console.log( 'made path from location history:', users[i].username )

					// make info box for their line
					if (locationArray.length > 0) {
						let lastpos = new google.maps.LatLng(locationArray[locationArray.length - 1].lat, locationArray[locationArray.length - 1].long)

						// Open the InfoWindow on mouseover:
						google.maps.event.addListener(lineForUser, 'mouseover', function() {
							infoWindow.setPosition(lastpos);

							if (users[i].isOnline == true) {
								infoWindow.setContent(users[i].username + ' is on the move!');
							} else {
								infoWindow.setContent(users[i].username + ' has taken a rest here!');
							}

							infoWindow.open(map);
						});

						// Close the InfoWindow on mouseout:
						google.maps.event.addListener(lineForUser, 'mouseout', function() {
							infoWindow.close();
						});
					}
					console.log( 'added info box for:', users[i].username )
				} else {
					console.log( 'skipping ourselves' )
				}
			}
		}
	}
}