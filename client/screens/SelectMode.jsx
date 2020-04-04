import * as React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-elements";

import { colors } from "../lib/Settings";

const SelectMode = ({ navigation }) => {
  const renderWeb = () => {
    if (Platform.OS === "web") {
      return (
        <View>
          <Text style={styles.text}>Download the app:</Text>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles.image}
              source={require(`../assets/images/app-store.png`)}
            />
            <Image
              style={styles.image}
              source={require(`../assets/images/google-play.png`)}
            />
          </View>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Mode:</Text>
      <View style={Platform.OS === 'web' ? { flexDirection: 'row' } : { flexDirection: 'column' }}>
        <Button
          title="Multiplayer"
          type="solid"
          buttonStyle={styles.button}
          onPress={() => navigation.navigate("Multiplayer")}
        />
        <Button
          title="Online Multiplayer"
          type="solid"
          buttonStyle={styles.button}
          onPress={() => navigation.navigate("Online Multiplayer")}
        />
      </View>
      {renderWeb()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  buttonContainer: {
    width: 250,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: colors.main,
  },
  text: {
    color: "white",
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
});

export default SelectMode;
