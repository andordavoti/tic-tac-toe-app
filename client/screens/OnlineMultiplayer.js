import * as React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-elements";

import { colors } from "../lib/Settings";

export default class OnlineMultiplayer extends React.Component {

  render() {
    return <View style={styles.container}>
      <Text style={styles.text}>Select Mode:</Text>
      <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Button
          title="Roboplayer"
          type="solid"
          buttonStyle={styles.button}
        />
        <Button
          title="Multiplayer"
          type="solid"
          buttonStyle={styles.button}
        />
        <Button
          title="Online Multiplayer"
          type="solid"
          buttonStyle={styles.button}
        />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  text: {
    color: "white",
    margin: 20,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500"
  },
  button: {
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: colors.main
  },
  image: {
    flex: 1,
    height: 60,
    width: 200,
    margin: 10
  }
});