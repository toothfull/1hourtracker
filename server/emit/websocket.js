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
exports.wsServer = void 0;
const ws_1 = __importDefault(require("ws"));
const main_1 = require("./main");
const mongo_1 = require("./mongo");
exports.wsServer = new ws_1.default.Server({ server: main_1.webServer, path: '/websocket' });
exports.wsServer.on('connection', (client) => {
    console.log('New connection!');
    client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Message recieved: ' + message);
        const usernameID = yield (0, mongo_1.findUserByNameID)(message.toString());
        try {
            const data = JSON.parse(message.toString());
            (0, mongo_1.insertUserData)(data);
        }
        catch (_a) {
            client.send(usernameID.toString());
        }
    }));
});
