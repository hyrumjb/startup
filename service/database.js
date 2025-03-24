const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user')
const investmentsCollection = db.collection('investments');
const sharedInvestmentsCollection = db.collection('sharedInvestments');

(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database because ${ex.message}`);
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

async function addInvestment(investments) {
    return investmentsCollection.insertOne(investments);
}

const { ObjectId } = require('mongodb');

async function getUserInvestments(userId) {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId.');
    }
    return investmentsCollection.find({ userId: new ObjectId(userId) }).toArray();
}

async function addSharedInvestment(investment) {
    return sharedInvestmentsCollection.insertOne(investment);
}

async function getSharedInvestments(userName) {
    return sharedInvestmentsCollection.find({ recipient: userName }).toArray();
}

module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
    addInvestment,
    getUserInvestments,
    addSharedInvestment,
    getSharedInvestments,
};