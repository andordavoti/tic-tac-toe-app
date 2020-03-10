import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

import { colors } from '../lib/Settings'

function SelectMode({ navigation }) {
  return <View style={styles.container}>
    <Text style={styles.text}>Select Mode:</Text>
    <Button
      title='Roboplayer'
      type='solid'
      buttonStyle={styles.button}
      onPress={() => navigation.navigate('Roboplayer')}
    />
    <Button
      title='Multiplayer'
      type='solid'
      buttonStyle={styles.button}
      onPress={() => navigation.navigate('Multiplayer')}
    />
    <Button
      title='Online Multiplayer'
      type='solid'
      buttonStyle={styles.button}
      onPress={() => navigation.navigate('Online Multiplayer')}
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
    padding: 10,
    margin: 10,
    backgroundColor: colors.main
  }
})

export default SelectMode