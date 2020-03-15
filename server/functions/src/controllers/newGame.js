const NewGame = firestore => (req, res) => {
  const newLobby = firestore.collection('lobbies').doc();
  newLobby.set({
    playerOne: 1,
    playerTwo: 2,
  });

  return res.send('new game created');
};

module.exports = NewGame;
