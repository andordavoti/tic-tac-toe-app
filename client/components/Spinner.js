import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { colors } from '../lib/Settings';

export const withSpinner = WrappedComponent => ({ loading = true, msg, ...props }) =>
  loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />;

const Spinner = ({ size = 'large', color = colors.main, msg = undefined }) => (
  <View>
    <ActivityIndicator size={size} color={color} />
    {msg && <Text>{msg}</Text>}
  </View>
);

export default Spinner;
