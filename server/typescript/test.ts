import chai from 'chai'
import chaiHttp from 'chai-http'
import { app, webServer } from './main'
import { findUserByName, deleteUser, mongoDisconnect } from './mongo'

chai.use(chaiHttp)

suite ('Integration Testing', () => {

	test('Check response code', () => {
		chai.request(app).post('/username').end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
		})
	})

	test('Username validation', () => {

		chai.request(app).post('/username').send({username: 'kyle'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			deleteUser('kyle')
		})
		chai.request(app).post('/username').send({username: 'kyle_saffery'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			deleteUser('kyle_saffery')
		})
		chai.request(app).post('/username').send({username: 'kyle123'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation')
			deleteUser('kyle123')
		})


		chai.request(app).post('/username').send({username: 'k'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
		})
		chai.request(app).post('/username').send({username: 'kyle!'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
		})
		chai.request(app).post('/username').send({username: 'kyle_daniel_saffery'}).end((_, Response) => {
			chai.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation')
		})

	})

	test('Username is inseted into mongo', () => {

		chai.request(app).post('/username').send({username: 'insertTest'}).end( async () => {
			const result = await findUserByName( 'insertTest' )
			chai.assert.equal(result, 'insertTest', 'Username not inserted into mongo')
			deleteUser('insertTest')
		})
	})

	suiteTeardown(() => {
		webServer.close()
		mongoDisconnect()
	})
	
})