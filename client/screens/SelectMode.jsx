import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-paper";
import * as Haptics from 'expo-haptics'

import { colors } from "../lib/constants";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectHaptics, selectTheme } from "../redux/settings/settings.selectors";

const SelectMode = ({ navigation, hapticsEnabled, theme }) => {

  const styles = getStyleSheet(theme)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Mode:</Text>
      <View>
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
  hapticsEnabled: selectHaptics,
})

const getStyleSheet = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme === 'dark' ? colors.dark.bg : colors.light.bg
    },
    buttonContainer: {
      width: 250,
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      margin: 10,
      backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main
    },
    text: {
      color: theme === 'dark' ? colors.dark.text : colors.light.text,
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

export default connect(mapStateToProps)(SelectMode)