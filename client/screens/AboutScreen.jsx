import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { colors } from '../lib/Settings'

const SettingsScreen = () => {
    return <View style={styles.container}>
        <Text>Settings</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background
    }
})

export default SettingsScreen