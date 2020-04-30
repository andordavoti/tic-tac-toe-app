import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { checkGame } from '../lib/gameCanvasUtils';
import { colors } from '../lib/Settings';
import { connect } from 'react-redux';
import { selectHaptics, selectTheme } from '../redux/settings/settings.selectors';
import { createStructuredSelector } from 'reselect';
import { gridSizeDropdownItems } from '../lib/dropdownItems'
import Grid from './Grid';
import Dropdown from './Dropdown';

const GameCanvas = ({ theme, hapticsEnabled }) => {
  const initialState = {
    fieldTypes: [],
    turn: 'o',
    canvasFrozen: false,
    winnerColumns: [],
    gameStart: false,
    winner: null,
    tied: false,
    gridSize: 3
  };

  const [gameState, setGameState] = useState(initialState);

  const { fieldTypes, canvasFrozen, winnerColumns, gameStart, winner, tied, gridSize } = gameState

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
      text: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        margin: 20,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500"
      },
    });
  };

  const pressed = (num) => {
    if (!gameStart) {
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
    if (!gameStart) {
      const fieldTypesArray = new Array(gridSize * gridSize)
      fieldTypesArray.fill(null)

      console.log(fieldTypesArray)

      setGameState({
        ...gameState,
        fieldTypes: fieldTypesArray
      })
    }
  }, [gameStart])

  useEffect(() => {
    if (fieldTypes.length > 0) {
      const result = checkGame(fieldTypes, gridSize);

      if ((result.winner || result.tied) && !winner && !tied) {
        setGameState({
          ...gameState,
          winner: result.winner,
          tied: result.tied,
          winnerColumns: result.winnerColumns,
          canvasFrozen: true,
        });
      }
    }
  }, [gameState]);

  const onValueChange = (type, value) => {
    if (type === 'setGridSize') {
      setGameState({
        ...gameState,
        gridSize: value
      })
    }
  }

  const renderInfo = () => {
    const styles = getStyleSheet();
    let winnerOutput = null;

    if (tied) winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>;
    else
      winnerOutput = (
        <Text style={styles.winnerText}>
          The winner is {winner && winner.toUpperCase()}
        </Text>
      );

    if (canvasFrozen && (winner || tied)) {
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
              setGameState({ ...initialState, gridSize });
            }}
          >
            New Game
          </Button>
        </View>
      );
    } else if (!gameStart) {
      return (
        <>
          <View style={{ width: 130, alignSelf: 'center' }}>
            <Dropdown
              label='Grid Size:'
              styles={styles}
              value={gridSize}
              onValueChange={onValueChange}
              type='setGridSize'
              placeholder={{ label: 'Select Grid Size', value: null, color: '#9EA0A4' }}
              items={gridSizeDropdownItems} />
          </View>
          <Text style={styles.winnerText}>Press a column to start the game</Text>
        </>
      )
    } else return null;
  };

  const styles = getStyleSheet();

  return (
    <View style={styles.container}>
      <View>{renderInfo()}</View>
      <Grid
        handlePress={pressed}
        {...{ fieldTypes, tied, winner, winnerColumns, canvasFrozen, gridSize }}
      />
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
});

export default connect(mapStateToProps)(GameCanvas);
