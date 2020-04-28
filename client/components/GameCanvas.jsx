import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { checkGame } from '../lib/gameCanvasUtils';
import { colors } from '../lib/Settings';
import { connect } from 'react-redux';
import { selectHaptics, selectTheme } from '../redux/settings/settings.selectors';
import { createStructuredSelector } from 'reselect';
import Grid from './Grid';

const GameCanvas = ({ size, theme, hapticsEnabled }) => {
  const initialState = {
    fieldTypes: [null, null, null, null, null, null, null, null, null],
    turn: 'o',
    canvasFrozen: false,
    winnerColumns: [],
    gameStart: false,
    winner: null,
    tied: false,
  };

  const [gameState, setGameState] = useState(initialState);

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
        fontWeight: '400',
      },
      button: {
        margin: 20,
        marginBottom: 40,
        backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main,
      },
    });
  };

  const pressed = (num) => {
    if (!gameState.gameStart) {
      setGameState({
        ...gameState,
        gameStart: true,
      });
    }

    setGameState((prevState) => {
      const fieldTypesCopy = [...prevState.fieldTypes];
      fieldTypesCopy[num] = prevState.turn;

      return {
        ...prevState,
        fieldTypes: fieldTypesCopy,
        turn: prevState.turn === 'o' ? 'x' : 'o',
      };
    });
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
  };

  useEffect(() => {
    const result = checkGame(gameState.fieldTypes);

    if ((result.winner || result.tied) && !gameState.winner && !gameState.tied) {
      setGameState({
        ...gameState,
        winner: result.winner,
        tied: result.tied,
        winnerColumns: result.winnerColumns,
        canvasFrozen: true,
      });
    }
  }, [gameState]);

  const renderInfo = () => {
    const styles = getStyleSheet();
    let winnerOutput = null;

    if (gameState.tied) winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>;
    else
      winnerOutput = (
        <Text style={styles.winnerText}>
          The winner is {gameState.winner && gameState.winner.toUpperCase()}
        </Text>
      );

    if (gameState.canvasFrozen && (gameState.winner || gameState.tied)) {
      return (
        <View>
          <Text style={styles.gameOverText}>Game Over</Text>
          {winnerOutput}
          <Button
            type="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={() => {
              if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
              setGameState(initialState);
            }}
          >
            New Game
          </Button>
        </View>
      );
    } else if (!gameState.gameStart) {
      return <Text style={styles.winnerText}>Press a column to start the game</Text>;
    } else return null;
  };

  const styles = getStyleSheet();

  return (
    <View style={styles.container}>
      <View>{renderInfo()}</View>
      <Grid
        fieldTypes={gameState.fieldTypes}
        handlePress={pressed}
        tied={gameState.tied}
        winnerColumns={gameState.winnerColumns}
        canvasFrozen={gameState.canvasFrozen}
        size={size}
      />
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics,
});

export default connect(mapStateToProps)(GameCanvas);
