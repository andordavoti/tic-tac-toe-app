import React, { useState, useEffect, Props } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../../lib/constants';
import { firestore } from '../../lib/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import {
  selectLobbyId,
  selectFieldTypes,
  selectPlayerId,
  selectGame,
} from '../../redux/game/game.selectors';
import { selectHaptics, selectTheme } from '../../redux/settings/settings.selectors';
import { connect, useDispatch } from 'react-redux';
import { getFieldType, checkGame, getPlayerName } from '../../lib/gameCanvasUtils';
import { quitGame } from '../../redux/game/game.actions';
import { showToast } from '../../lib/toast';
import Grid from '../Grid';
import CountdownTimer from '../CountdownTimer';

interface GameState {
  fieldTypes: null[] | string[]
  playerId: number
  xIsNext: number
  gameStarted: boolean
  gameSize: 3 | 4
}

interface WinnerState {
  winner: null | 'x' | 'o',
  tied: boolean
  winnerColumns: null[] | number[]
}

interface Props {
  gameState: GameState
  lobbyId: string
  hapticsEnabled: boolean
  theme: 'light' | 'dark'
}

const initialState = {
  winner: null,
  tied: false,
  winnerColumns: [],
};

const OnlineGameCanvas: React.FC<Props> = ({ gameState, lobbyId, hapticsEnabled, theme }) => {
  const dispatch = useDispatch();
  const [timers, setTimers] = useState([]);
  const [winnerDetails, setWinnerDetails] = useState<WinnerState>(initialState);
  const { winner, winnerColumns, tied } = winnerDetails;
  const { fieldTypes, playerId, xIsNext, gameStarted, gameSize } = gameState;
  const timeOutDuration = 60000;
  const styles = getStyleSheet(theme);

  const canvasFrozen = playerId !== xIsNext;

  const handleFieldPress = async (num: number) => {
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

    await docRef.set(
      { fieldTypes: Array(gameSize * gameSize).fill(null), xIsNext: 0 },
      { merge: true }
    );
  };

  const handleNewGame = () => {
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    resetLobby();
  };

  useEffect(() => {
    const result = checkGame(fieldTypes, gameSize);
    if (result.winner && result.winnerColumns.length) {
      setWinnerDetails({ winner: result.winner, winnerColumns: result.winnerColumns });
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success' as any);
    } else if (winner) {
      setWinnerDetails(initialState);
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error' as any);
    } else if (result.tied) {
      setWinnerDetails({ ...initialState, tied: true });
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error' as any);
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
    }, timeOutDuration);

    setTimers([...timers, playerOnlineTimer]);

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        timers.shift();
      });
    };
  }, [fieldTypes]);

  return (
    <View style={styles.container}>
      {timers.length ? <CountdownTimer size={48} duration={timeOutDuration} /> : null}
      <Text style={styles.text}>
        {playerId === xIsNext ? 'Your turn' : `Player ${getPlayerName(xIsNext)} picking`}
      </Text>
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
            mode="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleNewGame}
          >
            New Game
          </Button>
        </View>
      ) : null}
      <Grid
        gridSize={gameSize}
        {...{
          fieldTypes,
          handlePress: handleFieldPress,
          tied,
          winner,
          winnerColumns,
          canvasFrozen,
        }}
      />
    </View>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  lobbyId: selectLobbyId,
  playerId: selectPlayerId,
  fieldTypes: selectFieldTypes,
  gameState: selectGame,
  theme: selectTheme,
  hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gameOverText: {
      color: colors[theme].text,
      margin: 20,
      fontSize: 30,
      textAlign: 'center',
      fontWeight: '500',
    },
    winnerText: {
      color: colors[theme].text,
      margin: 20,
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      color: colors[theme].text,
      marginTop: 20,
      fontSize: 20,
      textAlign: 'center',
      fontWeight: '500',
      marginBottom: 20,
    },
    button: {
      marginBottom: 40,
      backgroundColor: colors[theme].main
    },
  });
};

export default connect(mapStateToProps)(OnlineGameCanvas);
