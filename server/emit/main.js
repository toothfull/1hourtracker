"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
let ip = '0.0.0.0';
let port = 9000;
if (process.env.EXPRESS_IP) {
    ip = process.env.EXPRESS_IP;
}
if (process.env.EXPRESS_PORT) {
    port = parseInt(process.env.EXPRESS_PORT);
}
// parse application/x-www-form-urlencoded
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
exports.app.use(body_parser_1.default.json());
exports.app.use(express_1.default.static('../browser'));
exports.app.post('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameRecieved = req.body.username;
    const lineColourRecieved = req.body.lineColour;
    if ((0, validation_1.validation)(usernameRecieved)) {
        yield (0, mongo_1.username)(usernameRecieved, lineColourRecieved);
        res.header('Content-Type', 'text/plain');
        res.send('Recieved and passed checks!');
    }
    else {
        res.header('Content-Type', 'text/plain');
        res.send('Username failed checks!');
    }
}));
exports.app.get('/offlineUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offlineUsers = yield (0, mongo_1.fetchOfflineUsers)();
    res.send(offlineUsers);
}));
exports.webServer = exports.app.listen(port, ip, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Example app listening at http://${ip}:${port}`);
    yield (0, mongo_1.connect)();
    yield Promise.resolve().then(() => __importStar(require('./websocket')));
}));
