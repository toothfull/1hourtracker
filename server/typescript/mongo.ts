import { MongoClient } from 'mongodb'
import { srv, userName, password, url, atlas } from './credentials'

const uri = `${srv}://${userName}:${password}@${url}/${atlas}`

export const client =	new MongoClient(uri)

export async function connect() {
	try{
		await client.connect()
	
		await client.db('admin').command({ ping: 1 })
		console.log('Connected successfully to server')
	} finally {
		await client.close()
	}
}

export async function username( currentUsername: string ) {
	try {
		await client.connect()

		const database = client.db('Location_Storage')
		const userCollection = database.collection('User')
		const result = await userCollection.insertOne({
			username: currentUsername
		})

		console.log(`A document was inserted with the _id: ${result.insertedId}`)
	} finally {
		await client.close()
	}
}