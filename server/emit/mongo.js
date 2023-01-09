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
exports.mongoDisconnect = exports.liveUsers = exports.fetchOfflineUsers = exports.insertUserData = exports.deleteUser = exports.findUserByNameID = exports.doesUserExist = exports.findUserByID = exports.username = exports.connect = exports.client = void 0;
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
        catch (_a) {
            yield exports.client.close();
        }
    });
}
exports.connect = connect;
function username(currentUsername, lineColour) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const result = yield userCollection.insertOne({
            username: currentUsername,
            lineColour: lineColour,
            locations: []
        });
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        return result.insertedId;
    });
}
exports.username = username;
function findUserByID(usernameID) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const result = yield userCollection.findOne({ _id: new mongodb_1.ObjectId(usernameID) });
        if (result == null) {
            console.log('No document matches the provided query.');
            return false;
        }
        else {
            return result.username;
        }
    });
}
exports.findUserByID = findUserByID;
function doesUserExist(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const result = yield userCollection.findOne({ username: username });
        if (result == null) {
            console.log('No document matches the provided query.');
            return false;
        }
        else {
            return true;
        }
    });
}
exports.doesUserExist = doesUserExist;
function findUserByNameID(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const result = yield userCollection.findOne({ username: username });
        if (result == null) {
            console.log('No document matches the provided query.');
            return false;
        }
        else {
            return result._id;
        }
    });
}
exports.findUserByNameID = findUserByNameID;
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        yield userCollection.deleteOne({ username: username });
        console.log('Deleted ' + username + ' from database');
    });
}
exports.deleteUser = deleteUser;
function insertUserData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const result = yield userCollection.updateOne({ _id: new mongodb_1.ObjectId(data.usernameID) }, {
            $addToSet: {
                locations: {
                    lat: data.lat,
                    long: data.long,
                    timeStamp: data.timeStamp
                },
            },
        }, { upsert: false });
        console.log('Inserted user data into database ' + result);
    });
}
exports.insertUserData = insertUserData;
function fetchOfflineUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const usersData = yield userCollection.find({}).toArray();
        return usersData;
    });
}
exports.fetchOfflineUsers = fetchOfflineUsers;
function liveUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = exports.client.db('Location_Storage');
        const userCollection = database.collection('User');
        const usersData = yield userCollection.find({}).toArray();
        const users = [];
        for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            if (user.locations.length > 0) {
                const latestLocation = user.locations[user.locations.length - 1];
                // if the user has sent a location update within the last 10 minutes
                if (latestLocation.timeStamp >= (new Date().getTime() - 600 * 1000)) {
                    users.push({
                        username: user.username,
                        locations: user.locations,
                        lineColour: user.lineColour,
                        isOnline: true
                    });
                }
                else {
                    users.push({
                        username: user.username,
                        locations: user.locations,
                        lineColour: user.lineColour,
                        isOnline: false
                    });
                }
            }
            else {
                console.log(user.username + ' has no location data');
            }
        }
        return users;
    });
}
exports.liveUsers = liveUsers;
function mongoDisconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.client.close();
    });
}
exports.mongoDisconnect = mongoDisconnect;
