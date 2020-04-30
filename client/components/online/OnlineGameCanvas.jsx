import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../../lib/Settings';
import { firestore } from '../../lib/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import {
  selectLobbyId,
  selectFieldTypes,
  selectPlayerId,
  selectGame,
  selectGridSize,
} from '../../redux/game/game.selectors';
import { selectHaptics, selectTheme } from '../../redux/settings/settings.selectors';
import { connect, useDispatch } from 'react-redux';
import { getFieldType, checkGame, getPlayerName } from '../../lib/gameCanvasUtils';
import { quitGame } from '../../redux/game/game.actions';
import { showToast } from '../../lib/toast';
import Grid from '../Grid';
const initialState = {
  winner: null,
  tied: false,
  winnerColumns: [],
};

const OnlineGameCanvas = ({ gridSize, gameState, lobbyId, hapticsEnabled, theme }) => {
  const dispatch = useDispatch();
  const [timers, setTimers] = useState([]);
  const [winnerDetails, setWinnerDetails] = useState(initialState);
  const { winner, winnerColumns, tied } = winnerDetails;
  const { fieldTypes, playerId, xIsNext, gameStarted } = gameState;

  const canvasFrozen = playerId !== xIsNext;

  const handleFieldPress = async (num) => {
    if (canvasFrozen) return;
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    const newFieldTypes = [...fieldTypes];

    newFieldTypes[num] = getFieldType(playerId);

    await docRef.set(
      { gameStarted: true, xIsNext: xIsNext === 0 ? 1 : 0, fieldTypes: newFieldTypes },
      { merge: true }
    );

    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
  };

  const resetLobby = async () => {
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    await docRef.set({ fieldTypes: Array(gridSize * gridSize).fill(null), xIsNext: 0 }, { merge: true });
  };

  const handleNewGame = () => {
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    resetLobby();
  };

  useEffect(() => {
    const result = checkGame(fieldTypes, gridSize);
    if (result.winner && result.winnerColumns.length) {
      setWinnerDetails({ winner: result.winner, winnerColumns: result.winnerColumns });
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success');
    } else if (winner) {
      setWinnerDetails(initialState);
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error');
    } else if (result.tied) {
      setWinnerDetails({ ...initialState, tied: true });
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error');
    }

    timers.forEach((timer) => {
      clearTimeout(timer);
      timers.shift();
    });

    const playerOnlineTimer = setTimeout(() => {
      if (gameStarted && (!winner || !result.tied)) {
        dispatch(quitGame());
        showToast('Lobby dispanded due to inactivity', 3500);
      }
    }, 60000);

    setTimers([...timers, playerOnlineTimer]);

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        timers.shift();
      });
    };
  }, [fieldTypes]);

  const getStyleSheet = () => {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      gameOverText: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        margin: 20,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '500',
      },
      winnerText: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        margin: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      text: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        marginTop: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 20,
      },
      button: {
        marginBottom: 40,
        backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main,
      },
    })
  }

  const styles = getStyleSheet()

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Turn: Player {getPlayerName(xIsNext)}</Text>
      {Boolean(winner) || tied ? (
        <View>
          <Text style={styles.gameOverText}>
            {Boolean(winner)
              ? winner === getFieldType(playerId)
                ? 'You won'
                : 'You lost'
              : `It's a tie`}
          </Text>
          <Button
            type="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleNewGame}>
            New Game
          </Button>
        </View>
      ) : null}
      <Grid {...{ fieldTypes, gridSize, handlePress: handleFieldPress, tied, winner, winnerColumns, canvasFrozen }} />
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  lobbyId: selectLobbyId,
  playerId: selectPlayerId,
  fieldTypes: selectFieldTypes,
  gameState: selectGame,
  theme: selectTheme,
  hapticsEnabled: selectHaptics,
  gridSize: selectGridSize
});

export default connect(mapStateToProps)(OnlineGameCanvas);
