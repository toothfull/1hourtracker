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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByName = exports.findUserByID = exports.username = exports.connect = exports.client = void 0;
const mongodb_1 = require("mongodb");
const credentials_1 = require("./credentials");
const uri = `${credentials_1.srv}://${credentials_1.userName}:${credentials_1.password}@${credentials_1.url}/${credentials_1.atlas}`;
exports.client = new mongodb_1.MongoClient(uri);
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db('admin').command({ ping: 1 });
            console.log('Connected successfully to server');
        }
        finally {
            yield exports.client.close();
        }
    });
}
exports.connect = connect;
function username(currentUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            const database = exports.client.db('Location_Storage');
            const userCollection = database.collection('User');
            const result = yield userCollection.insertOne({
                username: currentUsername
            });
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            return result.insertedId;
        }
        finally {
            yield exports.client.close();
        }
    });
}
exports.username = username;
function findUserByID(usernameID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            const database = exports.client.db('Location_Storage');
            const userCollection = database.collection('User');
            const result = yield userCollection.findOne({ _id: usernameID });
            if (result == null) {
                console.log('No document matches the provided query.');
                return false;
            }
            else {
                return result.username;
            }
        }
        finally {
            yield exports.client.close();
        }
    });
}
exports.findUserByID = findUserByID;
function findUserByName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            const database = exports.client.db('Location_Storage');
            const userCollection = database.collection('User');
            const result = yield userCollection.findOne({ username: username });
            if (result == null) {
                console.log('No document matches the provided query.');
                return false;
            }
            else {
                return result.username;
            }
        }
        finally {
            yield exports.client.close();
        }
    });
}
exports.findUserByName = findUserByName;
