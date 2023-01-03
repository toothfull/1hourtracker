import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://kylesaffery:luigi123@cluster0.pgezcni.mongodb.net/test'

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