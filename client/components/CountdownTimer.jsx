import React from 'react';
import { Clock, Easing } from 'react-native-reanimated';
import { timing } from 'react-native-redash';
import CircularProgress from './CircularProgress';

const CountdownTimer = ({ duration, ...rest }) => {
  const clock = new Clock();

  const progress = timing({ clock, duration, from: 0, to: 1, easing: Easing.linear });

  return <CircularProgress progress={progress} {...rest} />;
};

export default CountdownTimer;