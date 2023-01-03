"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const main_1 = require("./main");
chai_1.default.use(chai_http_1.default);
suite('Integration Testing', () => {
    test('Check response code', () => {
        chai_1.default.request(main_1.app).post('/username').end((_, Response) => {
            chai_1.default.assert.equal(Response.status, 200, 'Status code is not 200');
        });
    });
    suiteTeardown(() => {
        main_1.webServer.close();
    });
});
