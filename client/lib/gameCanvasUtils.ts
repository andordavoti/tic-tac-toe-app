import { PlayerId, Winner, GridNumber, FieldTypes } from '../types/Game';

export const getFieldType = (playerId: PlayerId) =>
    playerId === 0 ? 'x' : 'o';

export const getPlayerName = (playerId: PlayerId) => {
    if (playerId === 0) return 'X';
    else if (playerId === 1) return 'O';
};

const combinations3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const combinations4 = [
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

const combinations5 = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
];

type FieldType = 'x' | 'o';

export const checkGame = (fieldTypes: FieldTypes, size: GridNumber = 3) => {
    const users: FieldType[] = ['x', 'o'];
    let tied = false;
    let winner = null as Winner;
    let winnerColumns: number[] = [];
    let winnerCombinations = combinations3;
    if (size === 3) {
        winnerCombinations = combinations3;
    }
    if (size === 4) {
        winnerCombinations = combinations4;
    }
    if (size === 5) {
        winnerCombinations = combinations5;
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
                winnerColumns = [
                    combination[0],
                    combination[1],
                    combination[2],
                ];
                break;
            } else if (
                size === 4 &&
                fieldTypes[combination[0]] === user &&
                fieldTypes[combination[1]] === user &&
                fieldTypes[combination[2]] === user &&
                fieldTypes[combination[3]] === user
            ) {
                winner = user;
                winnerColumns = [
                    combination[0],
                    combination[1],
                    combination[2],
                    combination[3],
                ];
                break;
            } else if (
                size === 5 &&
                fieldTypes[combination[0]] === user &&
                fieldTypes[combination[1]] === user &&
                fieldTypes[combination[2]] === user &&
                fieldTypes[combination[3]] === user &&
                fieldTypes[combination[4]] === user
            ) {
                winner = user;
                winnerColumns = [
                    combination[0],
                    combination[1],
                    combination[2],
                    combination[3],
                    combination[4],
                ];
                break;
            }
        }
    }

    let stringValues = 0;
    fieldTypes.forEach((fieldType: null | string) => {
        if (typeof fieldType === 'string') stringValues++;
    });

    if (!winner && stringValues === fieldTypes.length) tied = true;
    if (!winner && !tied) return undefined;
    return { winner, winnerColumns, tied };
};
