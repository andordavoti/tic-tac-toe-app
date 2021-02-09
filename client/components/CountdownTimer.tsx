import React from 'react';
import { Clock, Easing } from 'react-native-reanimated';
import { timing } from 'react-native-redash';
import CircularProgress from './CircularProgress';

const CountdownTimer: React.FC<PropTypes> = ({ size, duration }) => {
    const clock = new Clock();

    const progress = timing({
        clock,
        duration,
        from: 0,
        to: 1,
        easing: Easing.linear,
    });

    return <CircularProgress size={size} progress={progress} />;
};

interface PropTypes {
    size: number;
    duration: number;
}

export default CountdownTimer;
