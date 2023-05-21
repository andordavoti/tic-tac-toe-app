import express from 'express';
import { firestore as FirebaseFirestore } from 'firebase-admin';
import cors from 'cors';

// Controllers
import newGame from './controllers/newGame';

// Services
function server(firestore: FirebaseFirestore.Firestore) {
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());

    /**
     * @route /new
     * @method POST
     * @description creates a new game in the database and returns the game id as response.
     */
    app.post('/new', newGame(firestore));

    return app;
}

export default server;
