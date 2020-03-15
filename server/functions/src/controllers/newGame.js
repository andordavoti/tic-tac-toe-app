const shortid = require('shortid');

const NewGame = firestore => async (req, res) => {
  const newLobby = await firestore.collection('lobbies').doc(shortid.generate());

  const writeResult = await newLobby.set({
    canvas: [],
  });

  return res.send({ lobbyId: newLobby.id });
};

module.exports = NewGame;
