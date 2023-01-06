let webSocket;

function connectToWebsocket ( username ) {
	webSocket = new WebSocket('ws://localhost:1000/websocket');
	webSocket.onopen = function () {
		console.log('Connected to websocket');
		webSocket.send(username);
		
	}
	webSocket.onmessage = function (event) {
		console.log(event.data)
		const usernameID = event.data;
		countDown();
		getLocation(usernameID);
	}
}