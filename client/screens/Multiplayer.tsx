import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../lib/constants';
import GameCanvas from '../components/GameCanvas';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';

const Multiplayer: React.FC = () => {
    const theme = useSelector(selectTheme);
    const styles = getStyleSheet(theme);

    return (
        <View style={styles.container}>
            <GameCanvas />
        </View>
    );
};

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

export default Multiplayer;
