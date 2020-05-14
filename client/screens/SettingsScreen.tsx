import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Switch, Button } from 'react-native-paper';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { themeDropdownItems } from '../lib/dropdownItems';
import { colors, urls } from '../lib/constants';
import Dropdown from '../components/Dropdown';

import { connect } from 'react-redux';
import {
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
} from '../redux/settings/settings.action';
import { createStructuredSelector } from 'reselect';
import {
    selectTheme,
    selectSystemTheme,
    selectHaptics,
} from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';

interface Props {
    theme: ThemeMode;
    systemThemeEnabled: boolean;
    setCurrentTheme: (param: ThemeMode) => void;
    enableSystemTheme: (param: boolean) => void;
    enableHaptics: (param: boolean) => void;
    hapticsEnabled: boolean;
}

const SettingsScreen: React.FC<Props> = ({
    theme,
    systemThemeEnabled,
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
    hapticsEnabled,
}) => {
    const [selectedTheme, setSelectedTheme] = useState('system');

    const styles = getStyleSheet(theme);

    useEffect(() => {
        if (systemThemeEnabled) setSelectedTheme('system');
        else setSelectedTheme(theme);
    }, []);

    const onValueChange = (type: string, value: 'system' | ThemeMode) => {
        if (type === 'theme') {
            if (value === 'system') {
                enableSystemTheme(true);
                setSelectedTheme('system');
            }
            if (value === 'light' || value === 'dark') {
                setSelectedTheme(value);
                setCurrentTheme(value);
                enableSystemTheme(false);
            }
        }
    };

    const openLink = async (link: string) =>
        await WebBrowser.openBrowserAsync(link);

    return (
        <View style={styles.container}>
            <Dropdown
                label="Theme:"
                textStyle={styles.text}
                value={selectedTheme}
                onValueChange={onValueChange}
                type="theme"
                placeholder={{
                    label: 'Select Theme',
                    value: null,
                    color: '#9EA0A4',
                }}
                items={themeDropdownItems}
            />
            {Platform.OS === 'ios' ? (
                <View style={styles.row}>
                    <Text style={styles.text}>Haptics:</Text>
                    <Switch
                        color={colors[theme].main}
                        value={hapticsEnabled}
                        onValueChange={() => enableHaptics(!hapticsEnabled)}
                    />
                </View>
            ) : null}

            <View style={{ marginBottom: getBottomSpace() }}>
                <Text style={styles.header}>About the App:</Text>
                <Text style={{ ...styles.text, marginBottom: 20 }}>
                    Developed by:
                </Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => openLink(urls.andorGithub)}
                    >
                        <Text style={styles.textAuthor}>Andor Davoti</Text>
                    </TouchableOpacity>
                    <Text
                        style={{ ...styles.text, marginBottom: 20, margin: 5 }}
                    >
                        &#38;{' '}
                    </Text>

                    <TouchableOpacity
                        onPress={() => openLink(urls.sannaGithub)}
                    >
                        <Text style={styles.textAuthor}>Sanna Jammeh</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{ ...styles.row, marginBottom: 20 }}
                    onPress={() => openLink(urls.projectGithub)}
                >
                    <MaterialCommunityIcons
                        color={colors[theme].text}
                        name="github-circle"
                        size={25}
                    />
                    <Text style={styles.text}>Project on GitHub</Text>
                    <MaterialCommunityIcons
                        color={colors[theme].text}
                        name="github-circle"
                        size={25}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={() => {
                            if (Platform.OS === 'ios' && hapticsEnabled)
                                Haptics.selectionAsync();
                            StoreReview.requestReview();
                        }}
                    >
                        Rate App
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={() => {
                            if (Platform.OS === 'ios' && hapticsEnabled)
                                Haptics.selectionAsync();
                            Linking.openURL('mailto:andor.davoti@gmail.com');
                        }}
                    >
                        Contact us
                    </Button>
                </View>
                <Text style={styles.textVersion}>
                    Version: {Constants.manifest.version}
                </Text>
            </View>
        </View>
    );
};

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    systemThemeEnabled: selectSystemTheme,
    hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: ThemeMode) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors[theme].bg,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            margin: 10,
            fontWeight: 'bold',
        },
        textAuthor: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            margin: 5,
            marginBottom: 20,
            fontStyle: 'italic',
        },
        textVersion: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            margin: 20,
            fontWeight: 'bold',
        },
        header: {
            textAlign: 'center',
            fontSize: 25,
            color: colors[theme].text,
            fontWeight: '600',
            margin: 20,
            marginTop: 50,
            textDecorationLine: 'underline',
        },
        button: {
            margin: 10,
            backgroundColor: colors[theme].main,
        },
        rowData: {
            minHeight: 30,
            marginLeft: 25,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    });
};

export default connect(mapStateToProps, {
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
})(SettingsScreen);
