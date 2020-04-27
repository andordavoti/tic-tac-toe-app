import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorsWithTheme } from '../lib/Settings';
import { ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

export const withSpinner = WrappedComponent => ({ loading = true, msg, ...props }) =>
  loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />;

const Spinner = ({ theme, size = 'large', color = (theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.light.main), msg = undefined }) => (
  <View>
    <ActivityIndicator style={styles.spinner} size={size} color={color} />
    {msg && <Text style={styles.text}>{msg}</Text>}
  </View>
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    margin: 20,
    textAlign: 'center'
  },
  spinner: {
    marginTop: 20
  }
});

const mapStateToProps = createStructuredSelector({
  theme: selectTheme
})

export default connect(mapStateToProps)(Spinner);
