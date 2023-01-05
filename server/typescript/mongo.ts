import { MongoClient, WithId, Document } from 'mongodb'
import { srv, userName, password, url, atlas } from './credentials'

const uri = `${srv}://${userName}:${password}@${url}/${atlas}`

export const client =	new MongoClient(uri)

interface User extends WithId<Document> {
	username: string
}

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
		return result.insertedId
	} finally {
		await client.close()
	}
}

export async function findUserByID(usernameID: string){

	try {
		await client.connect()

		const database = client.db('Location_Storage')
		const userCollection = database.collection<User>('User')
		const result = await userCollection.findOne<User>({ _id: usernameID })
		

		if (result == null){
			console.log('No document matches the provided query.')
			return false
		}
		else{
			return result.username
		}
	}finally {
		await client.close()
	}

}

export async function findUserByName(username: string){

	try {
		await client.connect()

		const database = client.db('Location_Storage')
		const userCollection = database.collection<User>('User')
		const result = await userCollection.findOne<User>({ username: username })
		

		if (result == null){
			console.log('No document matches the provided query.')
			return false
		}
		else{
			return result.username
		}
	}finally {
		await client.close()
	}

}