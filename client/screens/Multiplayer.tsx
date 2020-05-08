import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../lib/constants';
import GameCanvas from '../components/GameCanvas';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';

interface Props {
  theme: ThemeMode;
}

const Multiplayer: React.FC<Props> = ({ theme }) => {
  const styles = getStyleSheet(theme);

  return (
    <View style={styles.container}>
      <GameCanvas />
    </View>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  theme: selectTheme,
});

const getStyleSheet = (theme: ThemeMode) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].bg,
    },
  });
};

export default connect(mapStateToProps)(Multiplayer);
