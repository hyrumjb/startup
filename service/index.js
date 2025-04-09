const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const path = require('path');
const { ObjectId } = require('mongodb');
const app = express();
const DB = require('./database.js')
const { peerProxy } = require('./peerProxy.js')
const http = require('http')

const authCookieName = 'token';
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
} else {
    app.use(express.static('public'));
}

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/users/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await DB.getUser(userName);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

apiRouter.post('/auth/create', async (req, res) => {
    try {
        if (await findUser('name', req.body.name)) {
            res.status(409).send({ msg: 'Existing user' });
        } else {
            const user = await createUser(req.body.name, req.body.password);
            setAuthCookie(res, user.token);
            res.json({ 
                name: user.name,
                _id: user._id
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    try {
        const user = await findUser('name', req.body.name);
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            await DB.updateUser(user);
            setAuthCookie(res, user.token);
            res.json({ 
                name: user.name,
                _id: user._id
            });
        } else {
            res.status(401).json({ msg: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

apiRouter.delete('/auth/logout', async (req, res) => {
    try {
        const user = await DB.getUserByToken(req.cookies[authCookieName]);
        if (user) {
            delete user.token;
            await DB.updateUser(user);
        }
        res.clearCookie(authCookieName);
        res.status(204).end();
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

const verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies[authCookieName];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const user = await DB.getUserByToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

apiRouter.get('/investments', verifyAuth, async (req, res) => {
    try {
        const investments = await DB.getUserInvestments(req.user._id);
        res.json(investments);
    } catch (error) {
        console.error('Error getting investments:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/investments', verifyAuth, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        if (!name || !price || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const investment = { 
            name,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            userId: req.user._id,
            createdAt: new Date()
        };
        
        const result = await DB.addInvestment(investment);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding investment:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/sharedInvestments', verifyAuth, async (req, res) => {
    try {
        const { investment: investmentId, recipient } = req.body;
        
        const investment = await DB.getInvestmentById(investmentId);
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        const recipientUser = await DB.getUser(recipient);
        if (!recipientUser) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
    
        const sharedInvestment = {
            investment: {
                id: investment._id,
                name: investment.name,
                price: investment.price,
                quantity: investment.quantity,
                createdAt: investment.createdAt
            }, 
            sharedBy: req.user.name, 
            recipient: recipientUser.name, 
            timestamp: Date.now()
        };

        await DB.addSharedInvestment(sharedInvestment);
        res.status(200).json({ msg: 'Investment shared successfully!' });
    } catch (error) {
        console.error('Error sharing investment:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.put('/investments/:id', verifyAuth, async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    console.log('Updating investment with ID:', id);
    console.log('Updated data:', { name, price, quantity });

    try {
        const investment = await DB.getInvestmentById(id);

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        const updatedInvestment = {
            ...investment,
            name: name || investment.name,
            price: price ? parseFloat(price) : investment.price,
            quantity: quantity ? parseFloat(quantity) : investment.quantity,
        };

        const result = await DB.updateInvestment(id, updatedInvestment);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating investment:', error);
        res.status(500).json({ error: 'Failed to update investment' });
    }
});

apiRouter.get('/sharedInvestments', verifyAuth, async (req, res) => {
    const sharedInvestments = await DB.getSharedInvestments(req.user.name);
    res.json(sharedInvestments);
});

app.use(function (err, req, res, next) {
    res.status(500).json({ type: err.name, message: err.message });
});

app.use((_req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
        res.sendFile('index.html', { root: 'public' });
    }
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
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

const httpServer = http.createServer(app);
peerProxy(httpServer);

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});