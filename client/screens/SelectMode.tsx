import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { colors, calcFromHeight, IS_IOS, IS_WEB, urls } from '../lib/constants';
import { ThemeMode } from '../types/Theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { openLink } from '../lib/openLink';
import { useHapticsEnabled, useSelectedTheme } from '../redux/settingsSlice';

interface Props {
    navigation: StackNavigationProp<any, 'Select Mode'>;
}

const SelectMode: React.FC<Props> = ({ navigation }) => {
    const theme = useSelectedTheme();
    const hapticsEnabled = useHapticsEnabled();

    const { height } = useWindowDimensions();

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
                        if (IS_IOS && hapticsEnabled) Haptics.selectionAsync();
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
                        if (IS_IOS && hapticsEnabled) Haptics.selectionAsync();
                    }}
                    contentStyle={{ margin: 10 }}
                >
                    Online Multiplayer
                </Button>
                {IS_WEB && (
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={() => {
                            navigation.navigate('Settings');
                            if (IS_IOS && hapticsEnabled)
                                Haptics.selectionAsync();
                        }}
                        contentStyle={{ margin: 10 }}
                    >
                        Settings
                    </Button>
                )}
            </View>
            {IS_WEB && (
                <>
                    <Text
                        style={[
                            styles.text,
                            {
                                marginTop: calcFromHeight(16, height),
                            },
                        ]}
                    >
                        Download the app:
                    </Text>
                    <View style={styles.storeButtonContainer}>
                        <TouchableOpacity
                            onPress={() => openLink(urls.appStoreUrl)}
                        >
                            <Image
                                resizeMode="contain"
                                style={styles.storeIcon}
                                source={require('../assets/app-store-badge.png')}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openLink(urls.playStoreUrl)}
                        >
                            <Image
                                resizeMode="contain"
                                style={styles.storeIcon}
                                source={require('../assets/google-play-badge.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

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
            marginBottom: calcFromHeight(8, height),
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

export default SelectMode;
