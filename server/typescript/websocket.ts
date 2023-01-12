import ws from 'ws'
import { webServer } from './main' 
import { findUserByNameID, insertUserData, liveUsers } from './mongo'

//Websocket
export const wsServer = new ws.Server({ server: webServer, path: '/websocket' })

//Broadcast all offline & online user data to all clients every 15 seccon ds
function broadcast( message: string ) {
	console.log('broadcasting to all clients:', 	)
	const connectedClients = Array.from(wsServer.clients.values())
	for (let i = 0; i < connectedClients.length; i++){
		const client = connectedClients[ i ]
		client.send(message)
	}
}

//Once a client connects...
wsServer.on('connection', (client) => {
	console.log('New connection!')

	client.on('message', async  (message) => {
		console.log('Message recieved: ' + message.toString())

		const usernameID = await findUserByNameID(message.toString())

		// if location update is received
		try {
			const data = JSON.parse(message.toString())
			insertUserData(data)

		// if username is received
		} catch {
			client.send(usernameID.toString())
		}
	

	})



})

//Execute broadcast every 15 secconds
setInterval(async () => { 
	const message = await liveUsers()
	broadcast(JSON.stringify(message))
}, 15000)
