const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js')

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/users/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await DB.getUser(userName);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json ({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('name', req.body.name)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.name, req.body.password);
        setAuthCookie(res, user.token);
        res.json({ name: user.name });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('name', req.body.name);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            await DB.updateUser(user);
            setAuthCookie(res, user.token);
            res.json({ name: user.name });
    } else {
        res.status(401).json({ msg: 'Unauthorized' });
    }
});

apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await DB.getUserByToken(req.cookies[authCookieName]);
    if (user) {
        delete user.token;
        await DB.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
    const user = await DB.getUserByToken(req.cookies[authCookieName]);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).json({ msg: 'Unauthorized' });
    }
};

apiRouter.get('/investments', verifyAuth, async (req, res) => {
    const investments = await DB.getUserInvestments(req.user._id);
    res.json(investments)
});

apiRouter.post('/investments', verifyAuth, async (req, res) => {
    try {
        const investment = { 
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            userId: new ObjectId(req.body.userId)
        };
        const result = await DB.addInvestment(investment);
        res.status(201).json({
            _id: result.insertedId,
            ...investment
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/sharedInvestments', verifyAuth, async (req, res) => {
    const { investment: investmentId, recipient } = req.body;
    const investment = await DB.getUserInvestments(investmentId);
    const recipientUser = await DB.getUser(recipient);

    if (!recipientUser) {
        return res.status(401).json({ msg: 'Recipient not found.' });
    }

    const sharedInvestment = {
        investment, 
        sharedBy: req.user.name, 
        recipient: recipientUser.name, 
        timestamp: Date.now()
    };
    await DB.addSharedInvestment(sharedInvestment);

    res.status(200).json({ msg: 'Investment shared successfully!' });
});

apiRouter.get('/sharedInvestments', verifyAuth, async (req, res) => {
    const sharedInvestments = await DB.getSharedInvestments(req.user.name);
    res.json(sharedInvestments);
});

app.use(function (err, req, res, next) {
    res.status(500).json({ type: err.name, message: err.message });
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

async function createUser(name, password) {
    try {  
        const passwordHash = await bcrypt.hash(password, 10);
        const user = {
            name: name,
            password: passwordHash,
            token: uuid.v4(),
        };
        await DB.addUser(user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function findUser(field, value) {
    if (!value) return null;

    if (field === 'token') {
        return DB.getUserByToken(value);
    }
    return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

const httpService = app.listen(port, () => {
    console.log(`Listening on ${port}`);
});