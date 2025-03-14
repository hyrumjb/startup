const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

let users = [];
let investments = [];

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('name', req.body.name)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.name, req.body.password);

        setAuthCookie(res, user.token);
        res.send({ name: user.name });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('name', req.body.name);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            setAuthCookie(res, user.token);
            res.send({ name: user.name });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

apiRouter.get('/finances', verifyAuth, (_req, res) => {
    res.send(investments)
});

apiRouter.post('/finances', verifyAuth, (req, res) => {
    investments = updateInvestments(req.body);
    res.send(investments);
});

apiRouter.post('/shareInvestment', verifyAuth, async (req, res) => {
    const { investment, recipient } = req.body;
    const user = await findUser('token', req.cookies[authCookieName]);

    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    saveSharedInvestment(user.name, recipient, investment);

    res.status(200).send({ msg: 'Investment shared successfully!' });
});

let sharedInvestmentsStore = {};

function saveSharedInvestment(sharedBy, recipient, investment) {
    if (!sharedInvestmentsStore[recipient]) {
        sharedInvestmentsStore[recipient] = [];
    }
    const sharedInvestment = { investment, sharedBy, id: Date.now() };
    sharedInvestmentsStore[recipient].push(sharedInvestment);
}

function getUserSharedInvestments(userName) {
    return sharedInvestmentsStore[userName] || [];
}

apiRouter.get('/sharedInvestments', verifyAuth, async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);

    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    const recipientShares = getUserSharedInvestments(user.name);
    res.json(recipientShares);
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

function updateInvestments(newInvestment) {
    investments.push(newInvestment);
    return investments;
}

async function createUser(name, password) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        name: name,
        password: passwordHash,
        token: uuid.v4(),
    };
    users.push(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: false,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});