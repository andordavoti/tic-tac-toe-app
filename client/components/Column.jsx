import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colorsWithTheme } from '../lib/Settings';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

const Column = ({ winnerColumns, num, disableFields, fieldType, action, theme }) => {
  const [isWinnerColumn, setIsWinnerColumn] = useState(false)

  useEffect(() => {
    checkIfWinnerColumn()
  }, [winnerColumns])

  const checkIfWinnerColumn = () => {
    if ((winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num) && !isWinnerColumn) {
      setIsWinnerColumn(true)
    }
    else if (winnerColumns) setIsWinnerColumn(false)
  }

  const getStyleSheet = () => {
    return StyleSheet.create({
      column: {
        maxWidth: Dimensions.get('window').height * 0.1,
        maxHeight: Dimensions.get('window').height * 0.1,
        width: Dimensions.get('window').width * 0.22,
        height: Dimensions.get('window').width * 0.22,
        backgroundColor: disableFields ? 'grey' : (theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.light.main),
        borderRadius: 10,
        margin: 10,
      }
    })
  }

  let icon;
  const styles = getStyleSheet()
  const currentFieldType = fieldType[num];

  if (currentFieldType === 'o') icon = 'circle-outline'
  else if (currentFieldType === 'x') icon = 'close'

  return (
    <TouchableOpacity
      disabled={disableFields || Boolean(currentFieldType)}
      style={styles.column}
      onPress={() => {
        if (!currentFieldType) action(num);
      }}>
      {currentFieldType !== '' ?
        <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
          <MaterialCommunityIcons
            style={{ textAlign: 'center', marginTop: 5 }}
            color={!isWinnerColumn ? 'white' : (theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.dark.main)}
            name={icon}
            size={70} />
        </View>
        : null}
    </TouchableOpacity>
  );
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme
})

export default connect(mapStateToProps)(Column)
