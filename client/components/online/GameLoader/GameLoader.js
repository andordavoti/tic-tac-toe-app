import React, { useEffect, useMemo, useReducer } from 'react';
import GameCanvas from '../../GameCanvas';
import { firestore, modifyPlayer, getConnectedPlayers } from '../../../lib/firebaseUtils';
import { GAME_STATE_CHANGE, GAME_LOADED } from './types';
import { withSpinner } from '../../Spinner';
import { gameStateChange, gameLoaded } from './actions';
import { View, Text, Clipboard } from 'react-native';

const GameCanvasWithSpinner = withSpinner(GameCanvas);

// Advanced State manipulation
const reducer = (state, action) => {
  switch (action.type) {
    case GAME_LOADED:
      return {
        ...state,
        ...action.payload,
        gameLoaded: true,
      };
    case GAME_STATE_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  lobbyId: undefined,
  canvas: undefined,
  players: [],
  gameLoaded: false,
};

const GameLoader = ({ styles, playerId, lobbyId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const disconnectPlayer = async () => {
    try {
      const docRef = firestore.collection('lobbies').doc(lobbyId);
      const getGameState = await docRef.get();
      const gamePlayers = getGameState.data().players;

      const players = modifyPlayer(gamePlayers, playerId, { connected: false });

      await docRef.set({ players }, { merge: true });
    } catch (err) {
      console.log(err.message);
    }
  };

  const connectPlayer = async () => {
    try {
      const docRef = firestore.collection('lobbies').doc(lobbyId);

      const players = modifyPlayer(state.players, playerId, { connected: true });

      await docRef.set({ players }, { merge: true });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    state.gameLoaded && connectPlayer();
  }, [state.gameLoaded]);

  useEffect(() => {
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    let initial = true;
    const channel = docRef.onSnapshot(
      snapshot => {
        // This code will change.
        if (initial) {
          dispatch(gameLoaded({ lobbyId, ...snapshot.data() }));
          initial = false;
        } else {
          dispatch(gameStateChange({ lobbyId, ...snapshot.data() }));
        }
      },
      err => console.error(err)
    );

    return () => {
      disconnectPlayer();
      channel();
    };
  }, [lobbyId]);

  const connectedPlayers = useMemo(() => {
    const result = state.players ? getConnectedPlayers(state.players) : 0;

    return result;
  }, [state.players]);

  const copyLobbyId = () => {
    Clipboard.setString(lobbyId);
  };

  return (
    <View>
      <Text style={styles.text} onPress={copyLobbyId}>
        LobbyID: {lobbyId}
      </Text>

      <Text style={styles.text}>You are player: {playerId + 1}</Text>

      <GameCanvasWithSpinner
        msg={`Waiting for players, [${connectedPlayers.length}] connected`}
        loading={connectedPlayers.length < 2}
      />
    </View>
  );
};

export default GameLoader;
