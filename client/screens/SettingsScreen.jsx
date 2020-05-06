import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native'
import { Switch, Button } from 'react-native-paper';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as StoreReview from 'expo-store-review';
import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { themeDropdownItems } from '../lib/dropdownItems'
import { colors } from '../lib/Settings'
import Dropdown from '../components/Dropdown'

import { connect } from 'react-redux'
import { setCurrentTheme, useSystemTheme, useHaptics } from '../redux/settings/settings.action'
import { createStructuredSelector } from 'reselect';
import { selectTheme, selectSystemTheme, selectHaptics } from '../redux/settings/settings.selectors';

const SettingsScreen = ({ theme, systemThemeEnabled, setCurrentTheme, useSystemTheme, useHaptics, hapticsEnabled }) => {

    const [selectedTheme, setSelectedTheme] = useState('system')

    const styles = getStyleSheet(theme)

    useEffect(() => {
        if (systemThemeEnabled) setSelectedTheme('system')
        else setSelectedTheme(theme)
    }, [])

    const onValueChange = (type, value) => {
        if (type === 'theme') {
            if (value === 'system') {
                useSystemTheme(true)
                setSelectedTheme('system')
            }
            if (value === 'light' || value === 'dark') {
                setSelectedTheme(value)
                setCurrentTheme(value)
                useSystemTheme(false)
            }
        }
    }

    const openLink = async link => await WebBrowser.openBrowserAsync(link)

    const links = {
        andor: 'https://github.com/andordavoti',
        sanna: 'https://github.com/sannajammeh',
        project: 'https://github.com/andordavoti/tic-tac-toe-app'
    }

    return <View style={styles.container}>
        <Dropdown
            label='Theme:'
            styles={styles}
            value={selectedTheme}
            onValueChange={onValueChange}
            type='theme'
            placeholder={{ label: 'Select Theme', value: null, color: '#9EA0A4' }}
            items={themeDropdownItems} />
        {
            Platform.OS === 'ios' ?
                <View style={styles.row}>
                    <Text style={styles.text}>Haptics:</Text>
                    <Switch
                        color={theme === 'dark' ? colors.dark.main : colors.light.main}
                        value={hapticsEnabled}
                        onValueChange={() => useHaptics(!hapticsEnabled)} />
                </View>
                : null
        }

        <View styles={{ marginBottom: getBottomSpace() }}>
            <Text style={styles.header}>About the App:</Text>
            <Text style={{ ...styles.text, marginBottom: 20 }}>Developed by:</Text>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => openLink(links.andor)}>
                    <Text style={styles.textAuthor}>Andor Davoti</Text>
                </TouchableOpacity>
                <Text style={{ ...styles.text, marginBottom: 20, margin: 5 }}>&#38; </Text>

                <TouchableOpacity onPress={() => openLink(links.sanna)}>
                    <Text style={styles.textAuthor}>Sanna Jammeh</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={{ ...styles.row, marginBottom: 20 }} onPress={() => openLink(links.project)}>
                <MaterialCommunityIcons color={theme === 'dark' ? colors.dark.text : colors.light.text} name='github-circle' size={25} />
                <Text style={styles.text}>Project on GitHub</Text>
                <MaterialCommunityIcons color={theme === 'dark' ? colors.dark.text : colors.light.text} name='github-circle' size={25} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    type="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                        StoreReview.requestReview()
                    }}>
                    Rate App
                        </Button>
                <Button
                    type="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                        Linking.openURL('mailto:andor.davoti@gmail.com')
                    }}>
                    Contact us
                    </Button>
            </View>
            <Text style={styles.textVersion}>Version: {Constants.manifest.version}</Text>
        </View>
    </View >
}

const mapStateToProps = createStructuredSelector({
    theme: selectTheme,
    systemThemeEnabled: selectSystemTheme,
    hapticsEnabled: selectHaptics
})

const getStyleSheet = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? colors.dark.bg : colors.light.bg
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        text: {
            textAlign: 'center',
            fontSize: 20,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            margin: 10,
            fontWeight: 'bold'
        },
        textAuthor: {
            textAlign: 'center',
            fontSize: 20,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            margin: 5,
            marginBottom: 20,
            fontStyle: 'italic',
        },
        textVersion: {
            textAlign: 'center',
            fontSize: 20,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            margin: 20,
            fontWeight: 'bold'
        },
        header: {
            textAlign: 'center',
            fontSize: 25,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            fontWeight: '600',
            margin: 20,
            marginTop: 50,
            textDecorationLine: 'underline'
        },
        button: {
            margin: 10,
            backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main,
        },
        rowData: {
            minHeight: 30,
            marginLeft: 25,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    })
}

export default connect(mapStateToProps, { setCurrentTheme, useSystemTheme, useHaptics })(SettingsScreen)