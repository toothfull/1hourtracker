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
function broadcast(message) {
    console.log('broadcasting to all clients:', message);
    const connectedClients = Array.from(exports.wsServer.clients.values());
    for (let i = 0; i < connectedClients.length; i++) {
        const client = connectedClients[i];
        client.send(message);
    }
}
exports.wsServer.on('connection', (client) => {
    console.log('New connection!');
    client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Message recieved: ' + message.toString());
        const usernameID = yield (0, mongo_1.findUserByNameID)(message.toString());
        // if location update is received
        try {
            const data = JSON.parse(message.toString());
            (0, mongo_1.insertUserData)(data);
            // if username is received
        }
        catch (_a) {
            client.send(usernameID.toString());
        }
    }));
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, mongo_1.liveUsers)();
    broadcast(JSON.stringify(message));
}), 15000);
