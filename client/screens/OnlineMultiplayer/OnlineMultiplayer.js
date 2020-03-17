import React, { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import { View, StyleSheet, Clipboard } from 'react-native';

import { colors, urls } from '../../lib/Settings';
import { firestore } from '../../lib/firebaseUtils';
import PlayerMenu from '../../components/online/PlayerMenu';
import { withSpinner } from '../../components/Spinner';
import GameLoader from '../../components/online/GameLoader/GameLoader';

// Wrapping gamecanvas and playermenu in the spinner HOC component
const PlayerMenuWithSpinner = withSpinner(PlayerMenu);

const OnlineMultiplayer = () => {
  const [textInput, setTextInput] = useState({
    value: '',
    err: false,
  });
  const [loading, setLoading] = useState(false);

  const [lobbyData, setLobbyData] = useState({
    playerId: undefined,
    lobbyId: undefined,
  });

  const handleNewGame = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: 'POST',
        url: `${urls.gameUrl}/new`,
      });

      const { data } = response;

      setLobbyData({ lobbyId: data.lobbyId, playerId: 0 });
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

    setLobbyData({ lobbyId: textInput.value, playerId: 1 });
  };

  const handleInputChange = text => {
    setTextInput({ ...textInput, value: text });
  };

  // const renderContent = () => {
  //   if (loading) {
  //     return <Spinner msg="Creating lobby" />;
  //   } else {
  //     if (!gameLobby) {
  //       console.log('no game lobby');
  //       return (
  //         <PlayerMenu
  //           {...{ styles, textInput, handleInputChange, handleNewGame, handleJoinGame }}
  //         />
  //       );
  //     } else if (gameLobby && gameLobby.players.length > 1) {
  //       console.log('game lobby and no players');
  //       return <GameCanvas />;
  //     } else {
  //       <Text>Random</Text>;
  //     }
  //   }
  // };
  // console.log('render called');
  const { lobbyId, playerId } = lobbyData;
  return (
    <View style={styles.container}>
      {lobbyId ? (
        <GameLoader styles={styles} playerId={playerId} lobbyId={lobbyId} />
      ) : (
        //No nested if, loading state passed directly to component
        <PlayerMenuWithSpinner
          msg="Connecting to game"
          loading={loading}
          {...{ styles, textInput, handleInputChange, handleNewGame, handleJoinGame }}
        />
        //No nested if, loading state passed directly to component
      )}
    </View>
  );
};

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
    fontWeight: '500',
  },
  button: {
    width: 200,
    padding: 10,
    margin: 10,
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

export default OnlineMultiplayer;
