export const getFieldType = (playerId) => (playerId === 0 ? 'x' : 'o');

export const checkGame = (fieldTypes, size = 3) => {
  const users = ['x', 'o'];
  let tied = false;
  let winner = null;
  let winnerColumns = [];
  let winnerCombinations;

  if (size === 3) {
    winnerCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  if (size === 4) {
    winnerCombinations = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [0, 5, 10, 15],
      [3, 6, 9, 12],
    ];
  }

  for (const user of users) {
    for (const combination of winnerCombinations) {
      if (
        size === 3 &&
        fieldTypes[combination[0]] === user &&
        fieldTypes[combination[1]] === user &&
        fieldTypes[combination[2]] === user
      ) {
        winner = user;
        winnerColumns = [combination[0], combination[1], combination[2]];
        break;
      } else if (
        size === 4 &&
        fieldTypes[combination[0]] === user &&
        fieldTypes[combination[1]] === user &&
        fieldTypes[combination[2]] === user &&
        fieldTypes[combination[3]] === user
      ) {
        winner = user;
        winnerColumns = [combination[0], combination[1], combination[2], combination[3]];
        break;
      }
    }
  }

  let stringValues = 0;
  fieldTypes.forEach((fieldType) => {
    if (typeof fieldType === 'string') stringValues++;
  });

  if (!winner && stringValues === fieldTypes.length) tied = true;
  return { winner, winnerColumns, tied };
};

export const getPlayerName = (playerId) => {
  if (playerId === 0) return 'X';
  else if (playerId === 1) return 'O';
};
