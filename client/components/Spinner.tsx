import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/constants';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';

interface Props {
  msg: string;
  size: 'small' | 'large' | number;
}

const Spinner: React.FC<Props> = ({ msg, size = 'large' }) => {
  const theme = useSelector(selectTheme);
  const styles = getStyleSheet(theme);

  return (
    <View>
      <ActivityIndicator color={colors[theme].main} size={size} />
      <Text style={styles.text}>{msg}</Text>
    </View>
  );
};

const getStyleSheet = (theme: ThemeMode) => {
  return StyleSheet.create({
    text: {
      color: colors[theme].text,
      fontWeight: 'bold',
      fontSize: 15,
      margin: 20,
      textAlign: 'center',
    },
  });
};

export default Spinner;
