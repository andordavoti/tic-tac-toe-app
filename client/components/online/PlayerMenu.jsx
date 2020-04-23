import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Clipboard, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../../lib/Settings';
import { showToast } from '../../lib/toast';

// Menu that displays "new game" or "Join game" options
const PlayerMenu = ({
  setTextInput,
  styles,
  textInput,
  handleInputChange,
  handleNewGame,
  handleJoinGame,
}) => {
  const insertFromClipboard = async () => {
    const text = await Clipboard.getString();
    console.log('insertFromClipboard -> text', text);
    showToast('Inserted text from Clipboard')
    setTextInput((prevState) => ({ ...prevState, value: text }));
  };

  return (
    <View>
      <Button onPress={handleNewGame}
        type="contained"
        style={styles.button}
        labelStyle={{ color: 'white' }}
        contentStyle={{ margin: 10 }}>
        New Game
      </Button>
      <Text style={styles.text}>Join Game:</Text>

      <TextInput
        style={styles.input}
        value={textInput.value} // state {...state} {random: '', textInputValue: ''}
        onChangeText={handleInputChange}
        keyboardAppearance="dark"
        selectionColor={colors.main}
        underlineColorAndroid={colors.main}
        placeholder="Enter lobby id"
        placeholderTextColor="lightgrey"
        autoCapitalize="none"
        underlineColorAndroid='transparent'
      />


      {
        Platform.OS === 'web' ? null :
          <TouchableOpacity onPress={insertFromClipboard}>
            <Image
              style={{ width: 30, height: 30, alignSelf: 'center' }}
              source={require(`../../assets/images/clipboard.png`)}
            />
          </TouchableOpacity>
      }

      {textInput.err && <Text style={styles.infoText}>{textInput.err}</Text>}

      <Button
        disabled={!textInput.value.length}
        onPress={handleJoinGame}
        type="contained"
        style={textInput.value.length ? styles.button : { ...styles.button, backgroundColor: 'grey' }}
        labelStyle={{ color: 'white' }}
        contentStyle={{ margin: 10 }}>
        Join
      </Button>
    </View>
  );
};

export default PlayerMenu;
