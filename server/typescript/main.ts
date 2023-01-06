//import {client, connect} from './mongo'
import express from 'express'
import bodyParser from 'body-parser'
import { username, connect, fetchOfflineUsers } from './mongo'
import { validation } from './validation'



export const app = express()
const port = 1000


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('../browser'))
 
app.post('/username', async (req, res) => {
	const usernameRecieved = req.body.username
	const lineColourRecieved = req.body.lineColour
	if (validation(usernameRecieved)){
		await username(usernameRecieved, lineColourRecieved)

		res.header( 'Content-Type', 'text/plain' )
		res.send('Recieved and passed checks!')
	}
	else{
		res.header( 'Content-Type', 'text/plain' )
		res.send('Username failed checks!')
	}
})

app.get('/offlineUsers', async (req,res) => {
	const offlineUsers = await fetchOfflineUsers()
	res.send(offlineUsers)
})

export const webServer = app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`)
	await connect()
	await import('./websocket')
})




