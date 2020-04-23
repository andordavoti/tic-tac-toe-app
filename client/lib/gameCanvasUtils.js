import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
export const getFieldType = (playerId) => (playerId === 0 ? 'x' : 'o');

export const checkGame = (fieldTypes) => {
  const users = ['x', 'o'];
  let winner = null;
  let winnerColumns = [];
  const winnerCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const user of users) {
    for (const combination of winnerCombinations) {
      if (
        fieldTypes[combination[0]] === user &&
        fieldTypes[combination[1]] === user &&
        fieldTypes[combination[2]] === user
      ) {
        if (Platform.OS === 'ios') Haptics.notificationAsync('success');
        winner = user;
        winnerColumns = [combination[0], combination[1], combination[2]];
        break;
      }
    }
  }
  return { winner, winnerColumns };
};

export const getPlayerName = playerId => {
  if (playerId === 0) return 'X'
  else if (playerId === 1) return 'O'
}