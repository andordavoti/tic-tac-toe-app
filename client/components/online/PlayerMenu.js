import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

// Menu that displays "new game" or "Join game" options
const PlayerMenu = ({ styles, textInput, handleInputChange, handleNewGame, handleJoinGame }) => {
  return (
    <View>
      <Button onPress={handleNewGame} title="New Game" type="solid" buttonStyle={styles.button} />
      <Text style={styles.text}>Join Game:</Text>

      <TextInput
        style={styles.input}
        value={textInput.value} // state {...state} {random: '', textInputValue: ''}
        onChangeText={handleInputChange}
      />

      <Button onPress={handleJoinGame} title="Join" type="solid" buttonStyle={styles.button} />
    </View>
  );
};

export default PlayerMenu;
