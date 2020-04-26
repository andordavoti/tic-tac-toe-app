import * as React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-paper";
import * as Haptics from 'expo-haptics'

import { colorsWithTheme } from "../lib/Settings";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectHaptics, selectTheme } from "../redux/settings/settings.selectors";

const SelectMode = ({ navigation, hapticsEnabled, theme }) => {

  const getStyleSheet = () => {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === 'dark' ? colorsWithTheme.dark.background : colorsWithTheme.light.background
      },
      buttonContainer: {
        width: 250,
        alignItems: 'center',
        justifyContent: 'center'
      },
      button: {
        margin: 10,
        backgroundColor: theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.light.main
      },
      text: {
        color: theme === 'dark' ? colorsWithTheme.dark.text : colorsWithTheme.light.text,
        margin: 20,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500"
      },
      image: {
        flex: 1,
        height: 60,
        width: 200,
        margin: 10
      }
    })
  }

  const styles = getStyleSheet()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Mode:</Text>
      <View style={Platform.OS === 'web' ? { flexDirection: 'row' } : { flexDirection: 'column' }}>
        <Button
          type="contained"
          style={styles.button}
          labelStyle={{ color: 'white' }}
          onPress={() => {
            navigation.navigate("Multiplayer")
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
          }}
          contentStyle={{ margin: 10 }}
        >Multiplayer</Button>
        <Button
          type="contained"
          style={styles.button}
          labelStyle={{ color: 'white' }}
          onPress={() => {
            navigation.navigate("Online Multiplayer")
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
          }}
          contentStyle={{ margin: 10 }}
        >Online Multiplayer</Button>
      </View>
    </View>
  );
};

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps)(SelectMode)