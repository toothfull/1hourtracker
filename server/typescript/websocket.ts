import ws from 'ws'
import { webServer } from './main' 
import { findUserByNameID, insertUserData } from './mongo'

export const wsServer = new ws.Server({ server: webServer, path: '/websocket' })

wsServer.on('connection', (client) => {
	console.log('New connection!')
	


	client.on('message', async  (message) => {
		console.log('Message recieved: ' + message)
		const usernameID = await findUserByNameID(message.toString())

		try {
			const data = JSON.parse(message.toString())
			insertUserData(data)

		} catch {
			client.send(usernameID.toString())
		}
		

	})

})
