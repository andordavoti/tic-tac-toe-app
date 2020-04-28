const express = require('express');
const cors = require('cors');

//Controllers
const NewGame = require('./controllers/newGame');

//Services
const admin = require('firebase-admin');
const firebaseKey = require('../firebaseKey.json');
admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
  databaseURL: 'https://ticktacktoe-7aa6d.firebaseio.com',
});
const firestore = admin.firestore();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
/**
 * @route /new
 * @description creates a new game in the database and returns the game id as response.
 */
app.post('/new', NewGame(firestore));

module.exports = app;
