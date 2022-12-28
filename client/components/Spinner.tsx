import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, calcFromHeight } from '../lib/constants';
import { ActivityIndicator } from 'react-native-paper';
import { ThemeMode } from '../types/Theme';
import { useDimensions } from '@react-native-community/hooks';
import { useSelectedTheme } from '../redux/settingsSlice';

interface Props {
    msg: string;
    size?: 'small' | 'large' | number;
}

const Spinner: React.FC<Props> = ({ msg, size = 'large' }) => {
    const theme = useSelectedTheme();

    const { height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

    return (
        <View style={{ marginTop: calcFromHeight(10, height) }}>
            <ActivityIndicator color={colors[theme].main} size={size} />
            <Text style={styles.text}>{msg}</Text>
        </View>
    );
};

const getStyleSheet = (theme: ThemeMode, height: number) => {
    return StyleSheet.create({
        text: {
            color: colors[theme].text,
            fontWeight: 'bold',
            fontSize: 15,
            margin: calcFromHeight(20, height),
            textAlign: 'center',
        },
    });
};

export default Spinner;
