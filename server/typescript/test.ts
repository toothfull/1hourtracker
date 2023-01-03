import chai from 'chai'
import chaiHttp from 'chai-http'
import { app, webServer } from './main'

chai.use(chaiHttp)

suite ('Integration Testing', () => {

	test('Check response code', () => {
		chai.request(app).post('/username').end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
		})
	})

	suiteTeardown(() => {
		webServer.close()
	})
	
})