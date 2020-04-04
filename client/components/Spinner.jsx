import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/Settings';

export const withSpinner = WrappedComponent => ({ loading = true, msg, ...props }) =>
  loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />;

const Spinner = ({ size = 'large', color = colors.main, msg = undefined }) => (
  <View>
    <ActivityIndicator style={styles.spinner} size={size} color={color} />
    {msg && <Text style={styles.text}>{msg}</Text>}
  </View>
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: '300',
    fontSize: 15,
    margin: 20
  },
  spinner: {
    marginTop: 20
  }
});

export default Spinner;
