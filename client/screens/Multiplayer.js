import * as React from 'react'
import { View, StyleSheet } from 'react-native'

import { colors } from '../lib/Settings'
import GameCanvas from '../components/GameCanvas'

function Multiplayer() {
  return <View style={styles.container}>
    <GameCanvas size={3} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  }
})

export default Multiplayer