const cookieParser = require('cookie-parser');
const bcrypt = require('brcyptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

let users = [];
let finances = [];

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());

app.use(cookieParser());

