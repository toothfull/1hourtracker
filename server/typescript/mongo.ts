import { MongoClient, WithId, Document, ObjectId } from 'mongodb'
import { srv, userName, password, url, atlas } from './credentials'

const uri = `${srv}://${userName}:${password}@${url}/${atlas}`

export const client =	new MongoClient(uri)

interface User extends WithId<Document> {
	username: string
}

interface  userData {
	usernameID: string
	lat: number
	long: number
	lineColour: string
	timeStamp: number
}

export async function connect() {
	try{
		await client.connect()
	
		await client.db('admin').command({ ping: 1 })
		console.log('Connected successfully to server')
	} catch {
		await client.close()
	}
}

export async function username( currentUsername: string, lineColour: string) {

	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	const result = await userCollection.insertOne({
		username: currentUsername,
		lineColour: lineColour,
		locations:[]
	})

	console.log(`A document was inserted with the _id: ${result.insertedId}`)
	return result.insertedId
}

export async function findUserByID(usernameID: string){

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
}

export async function findUserByName(username: string){

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
}

export async function findUserByNameID(username: string){

	const database = client.db('Location_Storage')
	const userCollection = database.collection<User>('User')
	const result = await userCollection.findOne<User>({ username: username })
	

	if (result == null){
		console.log('No document matches the provided query.')
		return false
	}
	else{
		return result._id
	}
}

export async function deleteUser(username: string) {
	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	await userCollection.deleteOne({ username: username })
	console.log('Deleted ' + username + ' from database')
}

export async function insertUserData(data: userData) {
	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	const result = await userCollection.updateOne(
		{ _id: new ObjectId(data.usernameID) },
		{
			$addToSet: {
				locations: {
					lat: data.lat,
					long: data.long,
					timeStamp: data.timeStamp
				},
			},
		},
		{ upsert: false }
	)
	console.log('Inserted user data into database ' + result)

}

export async function fetchOfflineUsers(){
	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	const usersData = await userCollection.find({}).toArray()

	return usersData
}

export async function mongoDisconnect() {
	await client.close()
}