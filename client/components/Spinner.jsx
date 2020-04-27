import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorsWithTheme } from '../lib/Settings';
import { ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

export const withSpinner = WrappedComponent => ({ loading = true, msg, ...props }) =>
  loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />;

const Spinner = ({ theme, msg, size = 'large' }) => {
  const getStyleSheet = () => {
    return StyleSheet.create({
      text: {
        color: theme === 'dark' ? colorsWithTheme.dark.text : colorsWithTheme.light.text,
        fontWeight: 'bold',
        fontSize: 15,
        margin: 20,
        textAlign: 'center'
      }
    })
  }

  const styles = getStyleSheet()

  //TODO: why is msg not showing up?
  console.log('msg: ', msg)

  return <View>
    <ActivityIndicator
      color={theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.light.main}
      style={{ marginTop: 20 }}
      size={size}
    />
    <Text style={styles.text}>{msg}</Text>
  </View>
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme
})

export default connect(mapStateToProps)(Spinner);
