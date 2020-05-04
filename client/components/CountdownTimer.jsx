import React from 'react';
import { View, Text } from 'react-native';
import { Clock, Value, Easing } from 'react-native-reanimated';
import { timing } from 'react-native-redash';
import CircularProgress from './CircularProgress';

const CountdownTimer = ({ duration, ...rest }) => {
  const clock = new Clock();

  const progress = timing({ clock, duration, from: 0, to: 1, easing: Easing.linear });

  return <CircularProgress progress={progress} {...rest} />;
};

export default CountdownTimer;
