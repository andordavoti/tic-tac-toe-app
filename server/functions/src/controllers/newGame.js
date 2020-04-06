const shortid = require('shortid');

const NewGame = (firestore) => async (req, res) => {
  const newLobby = await firestore.collection('lobbies').doc(shortid.generate());

  const writeResult = await newLobby.set({
    fieldTypes: Array(9).fill(null),
    players: [
      {
        id: shortid.generate(),
        connected: false,
      },
      {
        id: shortid.generate(),
        connected: false,
      },
    ],
  });

  return res.send({ lobbyId: newLobby.id });
};

module.exports = NewGame;
