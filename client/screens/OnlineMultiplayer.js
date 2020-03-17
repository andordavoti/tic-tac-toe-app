import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { View, StyleSheet, Clipboard } from 'react-native';

import { colors, urls } from '../lib/Settings';
import { firestore } from '../lib/firebaseUtils';
import PlayerMenu from '../components/online/PlayerMenu';
import { withSpinner } from '../components/Spinner';
import GameCanvas from '../components/GameCanvas';

// Wrapping gamecanvas and playermenu in the spinner HOC component
const GameCanvasWithSpinner = withSpinner(GameCanvas);
const PlayerMenuWithSpinner = withSpinner(PlayerMenu);

const OnlineMultiplayer = () => {
  const [textInput, setTextInput] = useState({
    value: '',
    err: false,
  }); // useState returns [value, setValue];
  const [loading, setLoading] = useState(false);
  const [lobbyId, setLobbyId] = useState(undefined);
  const [gameLobby, setGameLobby] = useState(undefined);

  // Hook runs once on componentdidmount and whenever lobbyId changes. Fires off connectToGame which opens realtime connection to firebase.
  // ConnectToGame is called only if lobbyId is defined.
  useEffect(() => {
    console.log('useEffect called');
    let unsubscribe;
    if (lobbyId) {
      // Getting firestore document reference
      const docRef = firestore.collection('lobbies').doc(lobbyId);
      //copy lobbiId to users clipboard (need to give instructions to user)
      Clipboard.setString(lobbyId)
      // Attaching a firestore onSnapshot listener that listens for changes on the documentRef.
      // Any update will trigger the code inside the snapshot function;
      unsubscribe = docRef.onSnapshot(
        snapshot => {
          console.log('data found');
          // This code will change.
          console.log(snapshot.data());
          setGameLobby(snapshot.data());
        },
        err => console.error(err)
      );
    }
    return () => {
      console.log('unmounting');
    };
  }, [lobbyId]);

  const handleNewGame = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: 'POST',
        url: `${urls.gameUrl}/new`,
      });

      const { data } = response;
      setLoading(false);
      console.log('new game made');
      setLobbyId(data.lobbyId);
      console.log('Lobby id set');
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    // Fetching lobby from text input
    const snapshot = await firestore
      .collection('lobbies')
      .doc(textInput)
      .get();

    // Checking if lobby exists
    if (!snapshot.exists) return console.log('game does not exist');

    // Setting lobby ID if it exists which in turn activates useEffect hook to initialize realtime connection;
    setLobbyId(textInput.value);
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

  return (
    <View style={styles.container}>
      {gameLobby ? (
        <GameCanvasWithSpinner loading={gameLobby.players > 1} />
      ) : (
          //No nested if, loading state passed directly to component
          <PlayerMenuWithSpinner
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
