import express from 'express';
import { firestore } from 'firebase-admin';
import cors from 'cors';

//Controllers
import NewGame from './controllers/newGame';

//Services
function server(firestore: firestore.Firestore) {
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());

    /**
     * @route /new
     * @method POST
     * @description creates a new game in the database and returns the game id as response.
     */
    app.post('/new', NewGame(firestore));

    return app;
}

export default server;
