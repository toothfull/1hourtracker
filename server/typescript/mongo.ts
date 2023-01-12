import { MongoClient, WithId, Document, ObjectId } from 'mongodb'
import { srv, userName, password, url, atlas } from './credentials'

//Collects mongoDB login details and creates a new connection
const uri = `${srv}://${userName}:${password}@${url}/${atlas}`
export const client =	new MongoClient(uri)

//User interface
export interface User extends WithId<Document> {
	username: string
	locations: locations[]
	lineColour: string
}

//Locations interface
interface locations {
	lat: number
	long: number
	timeStamp: number
}

//User data interface
interface  userData {
	usernameID: string
	lat: number
	long: number
	lineColour: string
	timeStamp: number
}

//Initial connect function
export async function connect() {
	try{
		await client.connect()
	
		await client.db('admin').command({ ping: 1 })
		console.log('Connected successfully to server')
	} catch {
		await client.close()
	}
}

//Create new username document in users collection
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

//Finds a username be ID
export async function findUserByID(usernameID: string){

	const database = client.db('Location_Storage')
	const userCollection = database.collection<User>('User')
	const result = await userCollection.findOne<User>({ _id: new ObjectId( usernameID ) })
	

	if (result == null){
		console.log('No document matches the provided query.')
		return false
	}
	else{
		return result.username
	}
}

//Checks to see if user exists
export async function doesUserExist(username: string){

	const database = client.db('Location_Storage')
	const userCollection = database.collection<User>('User')
	const result = await userCollection.findOne<User>({ username: username })
	
	
	if (result == null){
		console.log('No document matches the provided query.')
		return false
	}
	else{
		return true
	}
}

//Find a users ID by name
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

//Delete user from collection
export async function deleteUser(username: string) {
	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	await userCollection.deleteOne({ username: username })
	console.log('Deleted ' + username + ' from database')
}

//Add a user's location & line data to their document
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

//Fetch a list of all users
export async function fetchOfflineUsers(){
	const database = client.db('Location_Storage')
	const userCollection = database.collection('User')
	const usersData = await userCollection.find({}).toArray()

	return usersData
}

//Fetch a list of users an determine if they're online or not
export async function liveUsers(){
	const database = client.db('Location_Storage')
	const userCollection = database.collection<User>('User')
	const usersData = await userCollection.find({}).toArray()
	const users = []

	for (let i = 0; i < usersData.length; i++){
		const user = usersData[i]
		
		if (user.locations.length > 0){
			const latestLocation = user.locations[user.locations.length - 1]
			
			// if the user has sent a location update within the last 10 minutes
			if (latestLocation.timeStamp >= (new Date().getTime() - 600 * 1000)) {
				users.push({
					username: user.username,
					locations: user.locations,
					lineColour: user.lineColour,
					isOnline: true
				})
			}
			else {
				users.push({
					username: user.username,
					locations: user.locations,
					lineColour: user.lineColour,
					isOnline: false
				})
			}
		}
		else{
			console.log(user.username + ' has no location data')
		}	
	}
	return users
}

//Disconnect from mongoDB
export async function mongoDisconnect() {
	await client.close()
}