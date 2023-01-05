//import {client, connect} from './mongo'
import express from 'express'
import bodyParser from 'body-parser'
import { username, connect, } from './mongo'
import { validation } from './validation'


export const app = express()
const port = 1000


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
 
app.post('/username', async (req, res) => {
	const usernameRecieved = req.body.username
	if (validation(usernameRecieved)){
		await username(usernameRecieved)

		res.header( 'Content-Type', 'text/plain' )
		res.send('Recieved and passed checks!')
	}
	else{
		res.header( 'Content-Type', 'text/plain' )
		res.send('Username failed checks!')
	}
	
	


})

export const webServer = app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`)
	await connect()
})




