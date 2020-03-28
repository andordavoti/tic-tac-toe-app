import React, { useState } from 'react';
import Axios from 'axios';
import { View, StyleSheet } from 'react-native';
import { colors, urls } from '../../lib/Settings';
import { firestore, getConnectedPlayers } from '../../lib/firebaseUtils';
import PlayerMenu from '../../components/online/PlayerMenu';
import { withSpinner } from '../../components/Spinner';
import GameLoader from '../../components/online/GameLoader/GameLoader';
// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectPlayerId, selectLobbyId } from '../../redux/game/game.selectors';
import { setLobbyId, setPlayerId } from '../../redux/game/game.actions';

// Wrapping gamecanvas and playermenu in the spinner HOC component
const PlayerMenuWithSpinner = withSpinner(PlayerMenu);

const OnlineMultiplayer = ({ lobbyId, playerId, setLobbyId, setPlayerId }) => {
  const [textInput, setTextInput] = useState({
    value: '',
    err: false,
  });
  const [loading, setLoading] = useState(false);

  const handleNewGame = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: 'POST',
        url: `${urls.gameUrl}/new`,
      });

      const { data } = response;

      setPlayerId(0);
      setLobbyId(data.lobbyId);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const handleJoinGame = async () => {
    // Fetching lobby from text input
    const snapshot = await firestore
      .collection('lobbies')
      .doc(textInput.value)
      .get();

    // Checking if lobby exists
    if (!snapshot.exists)
      return setTextInput({ ...textInput, err: 'This lobby does not exist...' });

    const players = snapshot.data().players;
    const connected = getConnectedPlayers(players);
    // const playerId = connected.length ? 1 : 0;
    const playerId = players[0].connected ? 1 : players[1].connected ? 0 : 0;

    if (connected.length >= 2) return setTextInput({ ...textInput, err: 'Lobby is full...' });

    setPlayerId(playerId);
    setLobbyId(textInput.value);
  };

  const handleInputChange = text => {
    setTextInput({ ...textInput, value: text });
  };

  return (
    <View style={styles.container}>
      {lobbyId ? (
        <GameLoader styles={styles} playerId={playerId} lobbyId={lobbyId} />
      ) : (
          //No nested if, loading state passed directly to component
          <PlayerMenuWithSpinner
            msg="Connecting to game server"
            loading={loading}
            {...{ styles, textInput, handleInputChange, handleNewGame, handleJoinGame }}
          />
          //No nested if, loading state passed directly to component
        )}
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  playerId: selectPlayerId,
  lobbyId: selectLobbyId,
});
const actions = {
  setLobbyId,
  setPlayerId,
};
export default connect(mapStateToProps, actions)(OnlineMultiplayer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  lobbyId: {
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoText: {
    color: 'red',
    margin: 5,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '200',
  },
  button: {
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: colors.main,
  },
  quitButton: {
    margin: 20,
    marginBottom: 40,
    backgroundColor: colors.main,
  },
  image: {
    flex: 1,
    height: 60,
    width: 200,
    margin: 10,
  },
  input: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'grey',
    height: 40,
    width: 200,
    margin: 10,
    borderRadius: 5,
    borderColor: colors.main,
    fontSize: 20,
  },
});
