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
const main_1 = require("./main");
const mongo_1 = require("./mongo");
chai_1.default.use(chai_http_1.default);
suite('Integration Testing', () => {
    test('Check response code', () => {
        chai_1.default.request(main_1.app).post('/username').end((_, Response) => {
            chai_1.default.assert.equal(Response.status, 200, 'Status code is not 200');
        });
    });
    test('Username validation', () => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
        });
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle_saffery' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
        });
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle123' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Recieved and passed checks!', 'Correct username failed validation');
        });
        chai_1.default.request(main_1.app).post('/username').send({ username: 'k' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
        });
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle!' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
        });
        chai_1.default.request(main_1.app).post('/username').send({ username: 'kyle_daniel_saffery' }).end((_, Response) => {
            chai_1.default.assert.equal(Response.text, 'Username failed checks!', 'Incorrect username passed validation');
        });
    });
    test('Username is inseted into mongo', () => {
        chai_1.default.request(main_1.app).post('/username').send({ username: 'insertTest' }).end((_, Response) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, mongo_1.findUserByName)('insertTest');
            chai_1.default.assert.equal(result, 'insertTest', 'Username not inserted into mongo');
        }));
    });
    suiteTeardown(() => {
        main_1.webServer.close();
    });
});
