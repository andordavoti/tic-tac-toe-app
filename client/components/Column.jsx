import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../lib/Settings';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

const Column = ({ winnerColumns, num, disableFields, fieldTypes, action, theme, tied, winner }) => {
  const [isWinnerColumn, setIsWinnerColumn] = useState(false)

  useEffect(() => {
    checkIfWinnerColumn()
  }, [winnerColumns])

  const checkIfWinnerColumn = () => {
    if ((winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num || winnerColumns[3] === num) && !isWinnerColumn) {
      setIsWinnerColumn(true)
    }
    else if (winnerColumns) setIsWinnerColumn(false)
  }

  const getStyleSheet = () => {
    return StyleSheet.create({
      column: {
        maxWidth: Dimensions.get('window').height * 0.08,
        maxHeight: Dimensions.get('window').height * 0.08,
        width: Dimensions.get('window').width * 0.22,
        height: Dimensions.get('window').width * 0.22,
        backgroundColor: disableFields ? (theme === 'dark' ? colors.dark.disabledColumn : colors.light.disabledColumn) : (theme === 'dark' ? colors.dark.main : colors.light.main),
        borderRadius: 10,
        margin: 10,
      }
    })
  }

  let icon
  const styles = getStyleSheet()
  const currentFieldTypes = fieldTypes[num]

  if (currentFieldTypes === 'o') icon = 'circle-outline'
  else if (currentFieldTypes === 'x') icon = 'close'

  return (
    <TouchableOpacity
      disabled={disableFields || Boolean(currentFieldTypes)}
      style={styles.column}
      onPress={() => { if (!currentFieldTypes) action(num) /* TODO: Add an else with error haptics here */ }}>
      {currentFieldTypes !== '' ?
        <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
          <MaterialCommunityIcons
            style={{ textAlign: 'center', marginTop: 6 }}
            color={!isWinnerColumn ? ((winner || tied) && disableFields ? 'red' : 'white') : (theme === 'dark' ? colors.dark.main : colors.dark.main)}
            name={icon}
            size={60} />
        </View>
        : null}
    </TouchableOpacity>
  );
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
})

export default connect(mapStateToProps)(Column)
