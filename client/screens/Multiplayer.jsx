import * as React from 'react'
import { View, StyleSheet } from 'react-native'

import { colorsWithTheme } from '../lib/Settings'
import GameCanvas from '../components/GameCanvas'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectTheme } from '../redux/settings/settings.selectors'

const Multiplayer = ({ theme }) => {

  const getStyleSheet = () => {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme === 'dark' ? colorsWithTheme.dark.bg : colorsWithTheme.light.bg
      }
    })
  }

  const styles = getStyleSheet()

  return <View style={styles.container}>
    <GameCanvas size={3} />
  </View>
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme
})

export default connect(mapStateToProps)(Multiplayer)