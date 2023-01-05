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
exports.webServer = exports.app = void 0;
//import {client, connect} from './mongo'
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongo_1 = require("./mongo");
const validation_1 = require("./validation");
exports.app = (0, express_1.default)();
const port = 1000;
// parse application/x-www-form-urlencoded
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
exports.app.use(body_parser_1.default.json());
exports.app.post('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameRecieved = req.body.username;
    if ((0, validation_1.validation)(usernameRecieved)) {
        yield (0, mongo_1.username)(usernameRecieved);
        res.header('Content-Type', 'text/plain');
        res.send('Recieved and passed checks!');
    }
    else {
        res.header('Content-Type', 'text/plain');
        res.send('Username failed checks!');
    }
}));
exports.webServer = exports.app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Example app listening at http://localhost:${port}`);
    yield (0, mongo_1.connect)();
}));
