import * as React from "react";
import { View, Text, Image, StyleSheet, Platform, TextInput } from "react-native";
import { Button } from "react-native-elements";

import { colors } from "../lib/Settings";

export default class OnlineMultiplayer extends React.Component {

  state = { textInputValue: '' }

  render() {
    return <View style={styles.container}>
      <Button
        title="New Game"
        type="solid"
        buttonStyle={styles.button}
      />
      <Text style={styles.text}>Join Game:</Text>

      <TextInput
        style={styles.input}
        value={this.state.textInputValue}
        onChangeText={(text) => this.setState({ textInputValue: text })}
      />

      <Button
        title="Join"
        type="solid"
        buttonStyle={styles.button}
      />
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
    marginTop: 20,
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
  },
  input: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'grey',
    height: 20,
    width: 200,
    margin: 10
  }
});