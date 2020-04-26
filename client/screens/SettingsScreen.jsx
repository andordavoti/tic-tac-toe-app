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

import { connect } from 'react-redux'
import { setCurrentTheme, useSystemTheme, useHaptics } from '../redux/settings/settings.action'
import { createStructuredSelector } from 'reselect';
import { selectTheme, selectSystemTheme, selectHaptics } from '../redux/settings/settings.selectors';

class SettingsScreen extends React.Component {

    state = { selectedTheme: 'system', reviewIsAvailable: false }

    async componentDidMount() {
        const { systemTheme, theme } = this.props

        if (systemTheme) this.setState({ selectedTheme: 'system' })
        else this.setState({ selectedTheme: theme })

        this.setState({ reviewIsAvailable: await StoreReview.hasAction() })
    }

    getStyleSheet = () => {
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
                fontWeight: 'bold'
            },
            textAuthors: {
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                margin: 5,
                marginBottom: 20,
                fontStyle: 'italic',
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
        const styles = this.getStyleSheet(theme)

        const { reviewIsAvailable, selectedTheme } = this.state
        const { theme, useHaptics, hapticsEnabled } = this.props

        return <View style={styles.container}>
            <Dropdown
                label='Theme:'
                styles={styles}
                value={selectedTheme}
                onValueChange={this.onValueChange}
                type='theme'
                placeholder={{ label: 'Select Theme', value: null, color: '#9EA0A4' }}
                items={themeDropdownItems} />
            {
                Platform.OS === 'ios' ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.text}>Haptics:</Text>
                        <Switch
                            color={colors.main}
                            value={hapticsEnabled}
                            onValueChange={() => useHaptics(!hapticsEnabled)
                            } />
                    </View>
                    : null
            }

            <View styles={{ marginBottom: getBottomSpace() }}>
                <Text style={styles.header}>About the App:</Text>
                <Text style={styles.text}>Developed by:</Text>
                <Text style={styles.textAuthors}>Andor Davoti &#38; Sanna Jammeh</Text>
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
                        </Button> : null
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
                <Text style={styles.textVersion}>Version: {Constants.manifest.version}</Text>
            </View>
        </View>
    }
}

const mapStateToProps = createStructuredSelector({
    theme: selectTheme,
    systemTheme: selectSystemTheme,
    hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps, { setCurrentTheme, useSystemTheme, useHaptics })(SettingsScreen)