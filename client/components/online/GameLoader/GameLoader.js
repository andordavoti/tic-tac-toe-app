import React, { useEffect, useMemo } from 'react';
import GameCanvas from '../../GameCanvas';
import { firestore, modifyPlayer, getConnectedPlayers } from '../../../lib/firebaseUtils';
import { withSpinner } from '../../Spinner';
import {
  setGameStateChange,
  setGameLoaded,
  setLobbyId,
  quitGame,
} from '../../../redux/game/game.actions';
import { View, Text, Clipboard, TouchableOpacity, Image, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectGame } from '../../../redux/game/game.selectors';

const GameCanvasWithSpinner = withSpinner(GameCanvas);

const GameLoader = ({ styles, game, setGameLoaded, setGameStateChange, quitGame }) => {
  const { playerId, lobbyId } = game;

  const disconnectPlayer = async () => {
    try {
      const docRef = firestore.collection('lobbies').doc(lobbyId);
      const getGameState = await docRef.get();
      const gamePlayers = getGameState.data().players;

      const players = modifyPlayer(gamePlayers, playerId, { connected: false });

      await docRef.set({ players }, { merge: true });
      quitGame();
    } catch (err) {
      console.log(err.message);
    }
  };

  const connectPlayer = async () => {
    try {
      const docRef = firestore.collection('lobbies').doc(lobbyId);

      const players = modifyPlayer(game.players, playerId, { connected: true });

      await docRef.set({ players }, { merge: true });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    game.gameLoaded && connectPlayer();
  }, [game.gameLoaded]);

  useEffect(() => {
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    let initial = true;
    const channel = docRef.onSnapshot(
      (snapshot) => {
        console.log('called');
        // This code will change.
        if (initial) {
          setGameLoaded({ lobbyId, ...snapshot.data() });
          initial = false;
        } else {
          setGameStateChange({ lobbyId, ...snapshot.data() });
        }
      },
      (err) => console.error(err)
    );

    return () => {
      disconnectPlayer();
      channel();
    };
  }, [lobbyId]);

  const connectedPlayers = useMemo(() => {
    const result = game.players ? getConnectedPlayers(game.players) : 0;

    return result;
  }, [game.players]);

  const copyLobbyId = () => {
    Clipboard.setString(lobbyId);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.text}>Lobby ID:</Text>
        <TouchableOpacity onPress={copyLobbyId}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.lobbyId}> {lobbyId}</Text>
            <Image
              style={{ marginTop: 15, marginLeft: 5, width: 30, height: 30 }}
              source={require(`../../../assets/images/clipboard.png`)}
            />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>You are player: {playerId + 1}</Text>

      <GameCanvasWithSpinner
        msg={`Waiting for player. ${playerId + 1} connected`}
        loading={connectedPlayers.length < 2}
        size={3}
      />

      <Button
        title="Quit Game"
        type="solid"
        buttonStyle={styles.quitButton}
        onPress={() => {
          if (Platform.OS === 'ios') Haptics.selectionAsync();

          //TODO: needs to disconnect players
          disconnectPlayer();
        }}
      />
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  game: selectGame,
});

const actions = {
  setGameStateChange,
  setGameLoaded,
  setLobbyId,
  quitGame,
};
export default connect(mapStateToProps, actions)(GameLoader);
