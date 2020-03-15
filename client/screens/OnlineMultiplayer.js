import React, { useState } from 'react';
import Axios from 'axios';
import { View, Text, Image, StyleSheet, Platform, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

import { colors, urls } from '../lib/Settings';

const OnlineMultiplayer = () => {
  const [textInput, setTextInput] = useState(''); // useState returns [value, setValue];
  const [loading, setLoading] = useState(false);
  const [lobbyId, setLobbyId] = useState(undefined);

  const handleNewGame = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: 'POST',
        url: `${urls.gameUrl}/new`,
      });

      const { data } = response;
      setLobbyId(data.lobbyId);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const handleJoinGame = () => {
    setLobbyId(textInput);
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <View>
          <Button
            onPress={handleNewGame}
            title="New Game"
            type="solid"
            buttonStyle={styles.button}
          />
          <Text style={styles.text}>Join Game:</Text>

          <TextInput
            style={styles.input}
            value={textInput} // state {...state} {random: '', textInputValue: ''}
            onChangeText={text => setTextInput(text)}
          />

          <Button onPress={handleJoinGame} title="Join" type="solid" buttonStyle={styles.button} />
          {lobbyId && <Text> {lobbyId} </Text>}
        </View>
      ) : (
        <Text>Loading</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: colors.main,
  },
  image: {
    flex: 1,
    height: 60,
    width: 200,
    margin: 10,
  },
  input: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'grey',
    height: 20,
    width: 200,
    margin: 10,
  },
});
export default OnlineMultiplayer;
