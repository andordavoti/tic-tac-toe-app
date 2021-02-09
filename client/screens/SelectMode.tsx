import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors, calcFromHeight } from '../lib/constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    selectHaptics,
    selectTheme,
} from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { openLink } from '../lib/openLink';
import { useDimensions } from '@react-native-community/hooks';

interface Props {
    theme: ThemeMode;
    hapticsEnabled: boolean;
    navigation: StackNavigationProp<any, 'Select Mode'>;
}

const SelectMode: React.FC<Props> = ({ navigation, hapticsEnabled, theme }) => {
    const { width, height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Select Mode:</Text>
            <View>
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        navigation.navigate('Multiplayer');
                        if (Platform.OS === 'ios' && hapticsEnabled)
                            Haptics.selectionAsync();
                    }}
                    contentStyle={{ margin: 10 }}
                >
                    Multiplayer
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        navigation.navigate('Online Multiplayer');
                        if (Platform.OS === 'ios' && hapticsEnabled)
                            Haptics.selectionAsync();
                    }}
                    contentStyle={{ margin: 10 }}
                >
                    Online Multiplayer
                </Button>
                {Platform.OS === 'web' ? (
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={() => {
                            navigation.navigate('Settings');
                            if (Platform.OS === 'ios' && hapticsEnabled)
                                Haptics.selectionAsync();
                        }}
                        contentStyle={{ margin: 10 }}
                    >
                        Settings
                    </Button>
                ) : null}
            </View>
            {Platform.OS === 'web' ? (
                <>
                    <Text style={styles.text}>Download the app:</Text>
                    <View style={styles.storeButtonContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                openLink(
                                    'https://apps.apple.com/us/app/tic-tac-toe-online/id1513609441?ls=1'
                                )
                            }
                        >
                            <Image
                                resizeMode="contain"
                                style={styles.storeIcon}
                                source={require('../assets/app-store-badge.png')}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                openLink(
                                    'https://play.google.com/store/apps/details?id=com.andordavoti.tictactoe.game'
                                )
                            }
                        >
                            <Image
                                resizeMode="contain"
                                style={styles.storeIcon}
                                source={require('../assets/google-play-badge.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            ) : null}
        </View>
    );
};

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: ThemeMode, height: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors[theme].bg,
        },
        buttonContainer: {
            width: 250,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button: {
            margin: calcFromHeight(8, height),
            backgroundColor: colors[theme].main,
        },
        text: {
            color: colors[theme].text,
            margin: calcFromHeight(15, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
        storeButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        storeIcon: {
            height: 60,
            width: 200,
            margin: 10,
        },
    });
};

export default connect(mapStateToProps)(SelectMode);
