import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

import { colors } from '../lib/Settings'

function SelectMode({ navigation }) {
  return <View style={styles.container}>
    <Text style={styles.text}>Select Mode:</Text>
    <Button
      title='Multiplayer'
      type='solid'
      buttonStyle={styles.button}
      onPress={() => navigation.navigate('Multiplayer')}
    />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  text: {
    color: 'white',
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center'
  },
  winnerText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: colors.main
  }
})

export default SelectMode