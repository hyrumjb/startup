const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user')
const financesCollection = db.collection('finances');

(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

function getUser(name) {
    return userCollection.findOne({ name: name });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    await userCollection.updateOne({ name: user.name }, { $set: user });
}

async function addFinances(finances) {
    return financesCollection.insertOne(finances);
}

const { ObjectId } = require('mongodb');

async function getUserFinances(userId) {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId.');
    }
    return financesCollection.find({ userId: new ObjectId(userId) }).toArray();
}

module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
    addFinances,
    getUserFinances,
};