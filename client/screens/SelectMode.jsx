import * as React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-paper";
import * as Haptics from 'expo-haptics'

import { colors } from "../lib/Settings";
import { connect } from "react-redux";

const SelectMode = ({ navigation, hapticsEnabled }) => {
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
})

const mapStateToProps = ({ settings: { hapticsEnabled } }) => ({ hapticsEnabled })

export default connect(mapStateToProps)(SelectMode)
