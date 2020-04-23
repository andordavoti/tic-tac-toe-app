import React from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { Switch, Button } from 'react-native-paper';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as StoreReview from 'expo-store-review';
import { Linking } from 'expo';

import { themeDropdownItems } from '../lib/dropdownItems'
import { colors } from '../lib/Settings'
import Dropdown from '../components/Dropdown'

class SettingsScreen extends React.Component {

    getStyleSheet = (theme) => {
        return StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background
            },
            text: {
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                margin: 10,
            },
            textAuthor: {
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                margin: 10,
                fontStyle: 'italic',
                lineHeight: 35
            },
            textVersion: {
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                margin: 10,
                fontWeight: 'bold'
            },
            header: {
                textAlign: 'center',
                fontSize: 25,
                color: 'white',
                fontWeight: '600',
                margin: 10,
                marginTop: 50
            },
            button: {
                margin: 10,
                backgroundColor: colors.main,
            },
            rowData: {
                minHeight: 30,
                marginLeft: 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
            toTheRight: {
                marginRight: 10
            },
        })
    }

    onValueChange = (type, value) => {
        const { setCurrentTheme, useSystemTheme, setMaxResults } = this.props

        if (type === 'theme') {
            if (value === 'system') {
                useSystemTheme(true)
                this.setState({ selectedTheme: 'system' })
            }
            if (value === 'light' || value === 'dark') {
                this.setState({ selectedTheme: value })
                setCurrentTheme(value)
                useSystemTheme(false)
            }
        }
        if (type === 'maxResults') {
            setMaxResults(value)
        }
    }

    render() {
        const theme = 'light'
        const reviewIsAvailable = true
        const styles = this.getStyleSheet(theme)

        return <View style={styles.container}>
            <Dropdown
                label='Theme:'
                styles={styles}
                value={'light'}
                onValueChange={this.onValueChange}
                type='theme'
                placeholder={{ label: 'Select Theme', value: null, color: '#9EA0A4' }}
                items={themeDropdownItems} />
            {
                Platform.OS === 'ios' ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.text}>Haptics:</Text>
                        <Switch
                            style={styles.toTheRight}
                            color={colors.main}
                            value={true}
                            onValueChange={() => useHaptics(!hapticsEnabled)
                            } />
                    </View>
                    : null
            }

            <View styles={{ marginBottom: getBottomSpace() }}>
                <Text style={styles.header}>About the App:</Text>
                <View style={{ flexDirection: 'row' }}>
                    {
                        reviewIsAvailable ?
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
                            : null
                    }

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
                <Text style={styles.textAuthor}>Developed by:{'\n'}Andor Davoti{'\n'}&{'\n'}Sanna Jammeh</Text>
                <Text style={styles.textVersion}>Version: {Constants.manifest.version}</Text>
            </View>
        </View>
    }
}


export default SettingsScreen