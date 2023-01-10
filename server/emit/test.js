"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const mongodb_1 = require("mongodb");
const main_1 = require("./main");
const mongo_1 = require("./mongo");
const validation_1 = require("./validation");
chai_1.default.use(chai_http_1.default);
suite('Unit Testing', () => {
    (0, mongo_1.connect)();
    test('Correct validation function', (done) => {
        chai_1.default.assert.equal((0, validation_1.validation)('kyle'), 'kyle', 'Correct username failed validation');
        done();
    });
    test('Incorect validation function', (done) => {
        chai_1.default.assert.isFalse((0, validation_1.validation)('kyle!'), 'Incorrect username passed validation');
        done();
    });
    test('Find user by name', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield (0, mongo_1.username)('bob', '#ffffff');
        const nameInDb = yield (0, mongo_1.findUserByID)(id.toString());
        chai_1.default.assert.equal(nameInDb, 'bob', 'name does not match whats in the database');
    }));
    test('Find user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_1.username)('alice', '#ffffff');
        const id = yield (0, mongo_1.findUserByNameID)('alice');
        if (id != false) {
            const database = mongo_1.client.db('Location_Storage');
            const userCollection = database.collection('User');
            const result = yield userCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (result == null) {
                console.log('No document matches the provided query.');
            }
            else {
                console.log(id.toString() + ' 11111');
                console.log(result._id.toString() + ' 11111');
                chai_1.default.assert.equal(id.toString(), result._id.toString(), 'id does not match whats in the database');
            }
        }
        else {
            console.log('no user found by id');
        }
    }));
    test('Does the user exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_1.username)('test1', '#ffffff');
        const answer = yield (0, mongo_1.doesUserExist)('test1');
        chai_1.default.assert.isTrue(answer, 'does not exist in database');
    }));
    test('Delete user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_1.username)('test2', '#ffffff');
        yield (0, mongo_1.deleteUser)('test2');
        const answer = yield (0, mongo_1.doesUserExist)('test2');
        chai_1.default.assert.isFalse(answer, 'user still exists in database');
    }));
});
suite('Integration Testing', () => {
    test('Check response code', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'test' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.status, 200, 'Status code is not 200');
            done();
        });
    });
    test('Username validation kyle', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.status, 200, 'Status code is not 200');
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
            done();
        });
    });
    test('Username validation kyle_saffery', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle_saffery' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
            done();
            (0, mongo_1.deleteUser)('kyle_saffery');
        });
    });
    test('Username validation kyle123', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle123' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
            done();
            (0, mongo_1.deleteUser)('kyle123');
        });
    });
    test('Username failed validation k', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'k' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
            done();
        });
    });
    test('Username failed validation kyle!', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle!' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
            done();
        });
    });
    test('Username failed validation kyle_daniel_saffery', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle_daniel_saffery' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
            done();
        });
    });
    test('Username is inseted into mongo', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'insertTest' }).end(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, mongo_1.doesUserExist)('insertTest');
            chai_1.default.assert.isTrue(result, 'Username not inserted into mongo');
            done();
        }));
    });
    test('Testing offline users', (done) => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'red_bull' }).end((_, Response1) => {
            chai_1.default.assert.equal(Response1.status, 200, 'Status code is not 200');
            chai_1.default.request(main_1.app).get('/offlineUsers').end((_, Response2) => {
                chai_1.default.assert.equal(Response2.status, 200, 'Status code is not 200');
                chai_1.default.assert.typeOf(Response2.body, 'array', 'Result was not an array');
                done();
            });
        });
    });
    suiteTeardown((done) => {
        (0, mongo_1.deleteUser)('test').then(() => {
            (0, mongo_1.deleteUser)('kyle').then(() => {
                (0, mongo_1.deleteUser)('kyle123').then(() => {
                    (0, mongo_1.deleteUser)('kyle_saffery').then(() => {
                        (0, mongo_1.deleteUser)('insertTest').then(() => {
                            (0, mongo_1.deleteUser)('red_bull').then(() => {
                                (0, mongo_1.deleteUser)('bob').then(() => {
                                    (0, mongo_1.deleteUser)('alice').then(() => {
                                        (0, mongo_1.deleteUser)('test1').then(() => {
                                            main_1.webServer.close();
                                            (0, mongo_1.mongoDisconnect)();
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
