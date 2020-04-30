import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-paper";
import * as Haptics from 'expo-haptics'

import { colors } from "../lib/Settings";
import { connect } from "react-redux";
import { setGridSize } from '../redux/game/game.actions'
import { createStructuredSelector } from "reselect";
import { selectHaptics, selectTheme } from "../redux/settings/settings.selectors";
import Dropdown from "../components/Dropdown";
import { gridSizeDropdownItems } from "../lib/dropdownItems";
import { selectGridSize } from "../redux/game/game.selectors";

const SelectMode = ({ navigation, hapticsEnabled, theme, gridSize, setGridSize }) => {

  const getStyleSheet = () => {
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

  const onValueChange = (type, value) => {
    if (type === 'setGridSize') setGridSize(value)
  }

  const styles = getStyleSheet()

  return (
    <View style={styles.container}>
      <Dropdown
        label='Grid Size:'
        styles={styles}
        value={gridSize}
        onValueChange={onValueChange}
        type='setGridSize'
        placeholder={{ label: 'Select Grid Size', value: null, color: '#9EA0A4' }}
        items={gridSizeDropdownItems} />

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
  gridSize: selectGridSize
})

export default connect(mapStateToProps, { setGridSize })(SelectMode)