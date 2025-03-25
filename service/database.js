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
        await client.connect();
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database because ${ex.message}`);
        process.exit(1);
    }
})();

async function getUser(name) {
    return await userCollection.findOne({ name });
}

async function getUserByToken(token) {
    return await userCollection.findOne({ token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    await userCollection.updateOne({ name: user.name }, { $set: user });
}

async function addInvestment(investment) {
    const newInvestment = {
        name: investment.name,
        quantity: investment.quantity,
        price: investment.price,
        userId: investment.userId,
        createdAt: new Date()
    };
    const results = await investmentsCollection.insertOne(newInvestment);
    return {
        _id: result.insertedId,
        ...newInvestment
    };
}

async function getUserInvestments(userId) {
    try {
        return await investmentsCollection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (error) {
        console.error('Error getting user investments:', error);
        throw error;
    }
}

async function getUserByUsername(userName) {
    return await userCollection.findOne({ name: userName });
}

async function addSharedInvestment(sharedInvestment) {
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
    getUserByUsername,
    addSharedInvestment,
    getSharedInvestments,
};