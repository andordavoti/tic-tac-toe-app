import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { colors, calcFromHeight } from '../lib/constants';
import { ActivityIndicator } from 'react-native-paper';
import { useSelectedTheme } from '../redux/settingsSlice';

interface Props {
    msg: string;
    size?: 'small' | 'large' | number;
}

const Spinner: React.FC<Props> = ({ msg, size = 'large' }) => {
    const theme = useSelectedTheme();
    const { height } = useWindowDimensions();
    return (
        <View style={{ marginTop: calcFromHeight(10, height) }}>
            <ActivityIndicator color={colors[theme].main} size={size} />
            <Text
                style={{
                    color: colors[theme].text,
                    fontWeight: 'bold',
                    fontSize: 15,
                    margin: calcFromHeight(20, height),
                    textAlign: 'center',
                }}
            >
                {msg}
            </Text>
        </View>
    );
};

export default Spinner;
