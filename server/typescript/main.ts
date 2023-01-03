//import {client, connect} from './mongo'
import express from 'express'
import bodyParser from 'body-parser'
import { username, connect } from './mongo'

export const app = express()
const port = 1000


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
 
app.post('/username', async (req, res) => {
	await username( req.body.username )
	res.send('Recieved!')
})

export const webServer = app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`)
	await connect()
})




