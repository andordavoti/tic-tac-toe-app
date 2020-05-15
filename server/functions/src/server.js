const express = require('express');
const cors = require('cors');

//Controllers
const NewGame = require('./controllers/newGame');

//Services
function server(firestore) {
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    /**
     * @route /new
     * @description creates a new game in the database and returns the game id as response.
     */
    app.post('/new', NewGame(firestore));
}

module.exports = server;
