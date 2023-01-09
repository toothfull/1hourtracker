import chai from 'chai'
import chaiHttp from 'chai-http'
import mongo from 'mongodb'
import { MongoClient, WithId, Document, ObjectId, } from 'mongodb'
import { app, webServer } from './main'
import { doesUserExist, deleteUser, mongoDisconnect, findUserByID, findUserByNameID, username, connect, client, User } from './mongo'
import { validation } from './validation'

chai.use(chaiHttp)

suite ('Unit Testing', () => {

	connect()

	test('Correct validation function', ( done ) => {
		chai.assert.equal(validation('kyle'), 'kyle', 'Correct username failed validation')
		done()
	})

	test('Incorect validation function', ( done ) => {
		chai.assert.isFalse(validation('kyle!'), 'Incorrect username passed validation')
		done()
	})

	test('Find user by name', async () => {
		const id = await username( 'test', '#ffffff' )
		const nameInDb = await findUserByID(id.toString())
		chai.assert.equal(nameInDb, 'test', 'name does not match whats in the database')
	})

	test('Find user by id', async () => {
		await username( 'test', '#ffffff' )
		const id = await findUserByNameID('test')

		const database = client.db('Location_Storage')
		const userCollection = database.collection<User>('User')
		const result = await userCollection.findOne<User>({ username: username })

		if (result == null){
			console.log('No document matches the provided query.')
		}
		else{
			console.log(id.toString() + ' 11111')
			console.log(result._id.toString() + ' 11111')
			chai.assert.equal(id.toString(), result._id.toString(), 'id does not match whats in the database')
		}
	})

	test('Does the user exist', async () => {
		await username('test1', '#ffffff')
		const answer = await doesUserExist('test1')
		chai.assert.isTrue(answer, 'does not exist in database')
	})

	test('Delete user', async () => {
		await username( 'test2', '#ffffff' )
		await deleteUser('test2')
		const answer = await doesUserExist('test2')

		chai.assert.isFalse(answer, 'user still exists in database')
	})

})




suite ('Integration Testing', () => {

	test('Check response code', ( done ) => {
		chai.request(app).post('/username').send({username: 'test'}).end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			done()
		})
	})

	test('Username validation kyle', (done) => {
		chai.request(app).post('/username').send({username: 'kyle'}).end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			done()
		})
	})

	test('Username validation kyle_saffery', (done) => {
		chai.request(app).post('/username').send({username: 'kyle_saffery'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			done()
			deleteUser('kyle_saffery')
		})
	})
	
	test('Username validation kyle123', (done) => {
		chai.request(app).post('/username').send({username: 'kyle123'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			done()
			deleteUser('kyle123')
		})
	})

	test('Username failed validation k', (done) => {
		chai.request(app).post('/username').send({username: 'k'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
			done()
		})
	})

	test('Username failed validation kyle!', (done) => {
		chai.request(app).post('/username').send({username: 'kyle!'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
			done()
		})
	})

	test('Username failed validation kyle_daniel_saffery', (done) => {
		chai.request(app).post('/username').send({username: 'kyle_daniel_saffery'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
			done()
		})
	})

	test('Username is inseted into mongo', (done) => {
		chai.request(app).post('/username').send({username: 'insertTest'}).end( async () => {
			const result = await doesUserExist( 'insertTest' )
			chai.assert.isTrue(result, 'Username not inserted into mongo')
			done()
		})
	})

	test('Testing offline users', (done) => {
		chai.request(app).post('/username').send({username: 'red_bull'}).end((_, Response1) => {
			chai.assert.equal(Response1.status, 200, 'Status code is not 200')

			chai.request(app).get('/offlineUsers').end((_, Response2) => {
				chai.assert.equal(Response2.status, 200, 'Status code is not 200')
				chai.assert.typeOf(Response2.body, 'array', 'Result was not an array')
				done()
			})
		})
	})

	suiteTeardown(( done ) => {
		deleteUser('test').then(() => {
			deleteUser('kyle').then(() => {
				deleteUser('kyle123').then(() => {
					deleteUser('kyle_saffery').then(() => {
						deleteUser('insertTest').then(() => {
							deleteUser('red_bull').then(() => {
								deleteUser('test').then(() => {
									deleteUser('test').then(() => {
										webServer.close()
										mongoDisconnect()
										done()
									})
								})
							})
						})
					})
				})
			})
		})
	})
})