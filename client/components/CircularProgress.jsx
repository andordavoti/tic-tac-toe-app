import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, { interpolate, multiply } from 'react-native-reanimated';
import { colors } from '../lib/Settings';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/settings/settings.selectors';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ progress, size = 64 }) => {
  const strokeWidth = size * (1 / 8);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const theme = useSelector(selectTheme);
  const α = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, Math.PI * 2],
  });

  const strokeDashoffset = multiply(α, radius);

  return (
    <Svg width={size} height={size}>
      <AnimatedCircle
        stroke={colors[theme].main}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        {...{ strokeWidth, strokeDashoffset }}
        strokeDasharray={`${circumference} ${circumference}`}
      />
    </Svg>
  );
};

export default CircularProgress;
