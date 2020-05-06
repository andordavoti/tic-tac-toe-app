import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../lib/constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

interface Props {
  winnerColumns: [] | number[]
  num: number
  disableFields: boolean
  fieldTypes: string[] | null[]
  action: (e: number) => void
  theme: 'light' | 'dark'
  tied: boolean
  winner: null | 'x' | 'o'
  gridSize: 3 | 4
}

const Column: React.FC<Props> = ({ winnerColumns, num, disableFields, fieldTypes, action, theme, tied, winner, gridSize }) => {

  const [isWinnerColumn, setIsWinnerColumn] = useState(false)

  const size3 = Dimensions.get('window').width * 0.22
  const size4 = Dimensions.get('window').height * 0.08

  const styles = getStyleSheet(theme, gridSize, disableFields, size3, size4)

  useEffect(() => {
    checkIfWinnerColumn()
  }, [winnerColumns])

  const checkIfWinnerColumn = () => {
    if ((winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num || winnerColumns[3] === num) && !isWinnerColumn) {
      setIsWinnerColumn(true)
    }
    else if (winnerColumns) setIsWinnerColumn(false)
  }

  let icon
  const currentFieldTypes = fieldTypes[num]

  if (currentFieldTypes === 'o') icon = 'circle-outline'
  else if (currentFieldTypes === 'x') icon = 'close'

  return (
    <TouchableOpacity
      disabled={disableFields || Boolean(currentFieldTypes)}
      style={styles.column}
      onPress={() => { if (!currentFieldTypes) action(num) /* TODO: Add an else with error haptics here */ }}>
      {currentFieldTypes !== '' ?
        <View style={styles.container}>
          <MaterialCommunityIcons
            style={{ textAlign: 'center', marginTop: 6 }}
            color={!isWinnerColumn ? ((winner || tied) && disableFields ? 'red' : 'white') : (theme === 'dark' ? colors.dark.main : colors.dark.main)}
            name={icon}
            size={gridSize === 4 ? 60 : 75} />
        </View>
        : null}
    </TouchableOpacity>
  );
}

const mapStateToProps = createStructuredSelector<any, any>({
  theme: selectTheme,
})

const getStyleSheet = (theme: 'light' | 'dark', gridSize: 3 | 4, disableFields: boolean, size3, size4) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    column: {
      width: gridSize === 4 ? size4 : size3,
      height: gridSize === 4 ? size4 : size3,
      backgroundColor: disableFields ? colors[theme].disabledColumn : colors[theme].main,
      borderRadius: 10,
      margin: 10,
    }
  })
}

export default connect(mapStateToProps)(Column)
