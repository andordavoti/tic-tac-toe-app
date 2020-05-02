import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/Settings';
import { ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

const Spinner = ({ theme, msg, size = 'large' }) => {

  const getStyleSheet = () => {
    return StyleSheet.create({
      text: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        fontWeight: 'bold',
        fontSize: 15,
        margin: 20,
        textAlign: 'center'
      }
    })
  }

  const styles = getStyleSheet()

  return <View>
    <ActivityIndicator
      color={theme === 'dark' ? colors.dark.main : colors.light.main}
      size={size} />
    <Text style={styles.text}>{msg}</Text>
  </View>
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
})

export default connect(mapStateToProps)(Spinner)