const { MongoClient, ObjectId } = require('mongodb');
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

async function getUserByToken(token) {
    return await userCollection.findOne({ token: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    await userCollection.updateOne({ name: user.name }, { $set: user });
}

async function addInvestment(investment) {
    const newInvestmnet = {
        name: investment.name,
        quantity: investment.quantity,
        price: investment.price,
        userId: new ObjectId(investment.userId),
    };
    await investmentsCollection.insertOne(newInvestment);
}

async function getUserInvestments(userId) {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId.');
    }
    return await investmentsCollection.find({ userId: new ObjectId(userId) }).toArray();
}

async function addSharedInvestment(investment) {
    const newSharedInvestment = {
        investment: new ObjectId(sharedInvestment.investment),
        sharedBy: sharedInvestment.sharedBy,
        recipient: sharedInvestment.recipient,
        timestamp: new Date(),
    };
    await sharedInvestmentsCollection.insertOne(newSharedInvestment);
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