import React from 'react';
import { View } from 'react-native';
import Column from './Column';
import { FieldTypes, GridNumber, Winner, WinnerColumns } from '../types/Game';

interface Props {
  fieldTypes: FieldTypes;
  gridSize: GridNumber;
  handlePress: Function;
  tied: boolean;
  winner: Winner;
  winnerColumns: WinnerColumns;
  canvasFrozen: boolean;
}

const Grid: React.FC<Props> = ({
  fieldTypes,
  gridSize,
  handlePress,
  tied,
  winner,
  winnerColumns,
  canvasFrozen,
}) => {
  const sizeArray = [...Array(gridSize).keys()];

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
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {sizeArray.map((x) => (
        <View style={{ flexDirection: 'row' }} key={x}>
          {sizeArray.map((y) => (
            <Column
              key={y}
              action={handlePress}
              num={getNum()}
              {...{ tied, winner, fieldTypes, winnerColumns, gridSize }}
              disableFields={canvasFrozen || Boolean(winnerColumns.length) || tied}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default Grid;
