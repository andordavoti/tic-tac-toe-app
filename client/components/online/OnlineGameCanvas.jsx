import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../../lib/Settings';
import Column from '../Column';
import { firestore } from '../../lib/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import {
  selectLobbyId,
  selectFieldTypes,
  selectPlayerId,
  selectGame,
} from '../../redux/game/game.selectors';
import { connect } from 'react-redux';
import { getFieldType, checkGame } from '../../lib/gameCanvasUtils';

const initialState = {
  winner: null,
  winnerColumns: [],
};

const OnlineGameCanvas = ({ size, gameState, lobbyId }) => {
  const [winnerDetails, setWinnerDetails] = useState(initialState);
  const { winner, winnerColumns } = winnerDetails;
  const { fieldTypes, playerId, xIsNext } = gameState;

  const canvasFrozen = playerId !== xIsNext;

  const handleFieldPress = async (num) => {
    if (canvasFrozen) return;
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    const newFieldTypes = [...fieldTypes];

    newFieldTypes[num] = getFieldType(playerId);

    await docRef.set(
      { xIsNext: xIsNext === 0 ? 1 : 0, fieldTypes: newFieldTypes },
      { merge: true }
    );
  };

  const resetLobby = async () => {
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    await docRef.set({ fieldTypes: Array(size * size).fill(null), xIsNext: 0 }, { merge: true });
  };

  const handleNewGame = () => {
    if (Platform.OS === 'ios') Haptics.selectionAsync();
    resetLobby();
  };

  useEffect(() => {
    const result = checkGame(fieldTypes);
    if (result.winner && result.winnerColumns.length) {
      setWinnerDetails({ winner: result.winner, winnerColumns: result.winnerColumns });
    } else if (winner) {
      setWinnerDetails(initialState);
    }
  }, [fieldTypes]);

  return (
    <View style={styles.container}>
      <Text> Turn is player {xIsNext + 1}</Text>
      {Boolean(winner) && (
        <View>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text>The winner is player {winner}</Text>
          <Button
            type="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleNewGame}>
            New Game
          </Button>
        </View>
      )}
      <RenderGrid
        {...{ fieldTypes, size, handlePress: handleFieldPress, winnerColumns, canvasFrozen }}
      />
    </View>
  );
};

const RenderGrid = ({ fieldTypes, size, handlePress, winnerColumns, canvasFrozen }) => {
  const sizeArray = [...Array(size).keys()];

  let num = 0;
  let initial = true;
  const getNum = () => {
    if (initial) {
      initial = false;
      return num;
    }
    num++;
    return num;
  };

  return (
    <View>
      {sizeArray.map((x) => (
        <View style={{ flexDirection: 'row' }} key={x}>
          {sizeArray.map((y) => (
            <Column
              key={y}
              action={handlePress}
              num={getNum()}
              fieldType={fieldTypes}
              winnerColumns={winnerColumns}
              disableFields={canvasFrozen || Boolean(winnerColumns.length)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    color: 'white',
    margin: 20,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  winnerText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    margin: 20,
    marginBottom: 40,
    backgroundColor: colors.main,
  },
});

const mapStateToProps = createStructuredSelector({
  lobbyId: selectLobbyId,
  playerId: selectPlayerId,
  fieldTypes: selectFieldTypes,
  gameState: selectGame,
});

export default connect(mapStateToProps)(OnlineGameCanvas);
