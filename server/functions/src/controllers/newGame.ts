import { firestore as FirebaseFirestore } from 'firebase-admin';
import { generate } from 'shortid';
import { Request, Response } from 'express';

const NewGame = (firestore: FirebaseFirestore.Firestore) => async (
    req: Request,
    res: Response
) => {
    const gameSize = req.body.gameSize || 3;
    const newLobby = firestore.collection('lobbies').doc(generate());

    await newLobby.set({
        gameSize,
        fieldTypes: Array(gameSize * gameSize).fill(null),
        xIsNext: 0,
        players: [
            {
                id: generate(),
                connected: false,
            },
            {
                id: generate(),
                connected: false,
            },
        ],
        createdAt: new Date(),
    });

    return res.send({ lobbyId: newLobby.id });
};

export default NewGame;
