import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../lib/constants';
import GameCanvas from '../components/GameCanvas';
import { ThemeMode } from '../types/Theme';
import { useSelectedTheme } from '../redux/settingsSlice';

const Multiplayer: React.FC = () => {
    const theme = useSelectedTheme();
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
