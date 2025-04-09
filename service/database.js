const { MongoClient, ObjectId } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
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
    const result = await userCollection.insertOne(user);
    return {
        _id: result.insertedId,
        name: user.name,
        token: user.token
    };
}

async function updateUser(user) {
    await userCollection.updateOne(
        { _id: user._id }, 
        { $set: { token: user.token } }
    );
}

async function addInvestment(investment) {
    const result = await investmentsCollection.insertOne(investment);
    return {
        _id: result.insertedId,
        ...investment
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
        investment: sharedInvestment.investment,
        sharedBy: sharedInvestment.sharedBy,
        recipient: sharedInvestment.recipient,
        timestamp: new Date(),
    };
    await sharedInvestmentsCollection.insertOne(newSharedInvestment);
}

async function getSharedInvestments(userName) {
    return await db.collection('sharedInvestments').find({
        recipient: userName
    }).toArray();
}

async function getInvestmentById(id) {
    try {
        return await investmentsCollection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
        console.error('Error getting investment by ID:', error);
        throw error;
    }
}

async function updateInvestment(id, updatedData) {
    try {
        const result = await db.collection('investments').updateOne (
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        console.log('Update result:', result);
        return result.modifiedCount > 0 ? updatedData : null;
    } catch (error) {
        console.error('Error updating investment:', error);
        throw error;
    }
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
    getInvestmentById,
    updateInvestment,
};