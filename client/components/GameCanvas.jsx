import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { checkGame } from '../lib/gameCanvasUtils';
import { colors } from '../lib/Settings';
import Column from './Column';
import { connect } from 'react-redux';
import { selectHaptics, selectTheme } from '../redux/settings/settings.selectors';
import { createStructuredSelector } from 'reselect';

const GameCanvas = ({ size, theme, hapticsEnabled }) => {

  const initialState = {
    fieldTypes: [null, null, null, null, null, null, null, null, null],
    turn: 'o',
    disableFields: false,
    winnerColumns: [],
    gameStart: false,
    winner: null,
    tied: false
  }

  const [gameState, setGameState] = useState(initialState)

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
        fontWeight: '400'
      },
      button: {
        margin: 20,
        marginBottom: 40,
        backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main,
      },
    })
  }

  const pressed = num => {
    let fieldTypesCopy = gameState.fieldTypes

    if (fieldTypesCopy[num] === null) {
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()

      if (gameState.turn === 'o') {
        fieldTypesCopy[num] = 'o'
        setGameState({
          ...gameState,
          fieldTypes: fieldTypesCopy,
          turn: 'x'
        })
      }
      else if (gameState.turn === 'x') {
        fieldTypesCopy[num] = 'x'
        setGameState({
          ...gameState,
          fieldTypes: fieldTypesCopy,
          turn: 'o'
        })
      }
    }

    const result = checkGame(gameState.fieldTypes)

    if (result.winner || result.tied) {
      setGameState({
        ...gameState,
        winner: result.winner,
        tied: result.tied,
        winnerColumns: result.winnerColumns,
        disableFields: true
      })
    }

    if (!gameState.gameStart) {
      setGameState({
        ...gameState,
        gameStart: true
      })
    }
  }

  const getNum = (y, x) => {
    //TODO: adopt same getNum as in onlineMultiplayer component
    if (x === 1) {
      return x + y - 2;
    }
    if (x === 2) {
      return x + y;
    }
    if (x === 3) {
      return x + y + 2;
    }
  }

  const renderGrid = () => {
    const sizeArray = [...Array(size + 1).keys()].slice(1);

    return <View>
      {sizeArray.map(x => (
        <View style={{ flexDirection: 'row' }} key={x}>
          {sizeArray.map(y => (
            <Column
              key={y}
              action={pressed}
              num={getNum(x, y)}
              fieldTypes={gameState.fieldTypes}
              winnerColumns={gameState.winnerColumns}
              disableFields={gameState.disableFields}
            />
          ))}
        </View>
      ))}
    </View>
  }

  const renderInfo = () => {
    const styles = getStyleSheet()
    let winnerOutput = null

    if (gameState.tied) winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>
    else winnerOutput = <Text style={styles.winnerText}>The winner is {gameState.winner && gameState.winner.toUpperCase()}</Text>

    if (gameState.disableFields && (gameState.winner || gameState.tied)) {
      return <View>
        <Text style={styles.gameOverText}>Game Over</Text>
        {winnerOutput}
        <Button
          type="contained"
          style={styles.button}
          labelStyle={{ color: 'white' }}
          onPress={() => {
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
            setGameState(initialState)
          }}>New Game</Button>
      </View>
    }
    else if (!gameState.gameStart) {
      return <Text style={styles.winnerText}>Press a column to start the game</Text>
    }
    else return null
  }

  const styles = getStyleSheet()

  return <View style={styles.container}>
    <View>{renderInfo()}</View>
    {renderGrid()}
  </View>
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps)(GameCanvas)