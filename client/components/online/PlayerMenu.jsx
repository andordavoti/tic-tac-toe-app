import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Clipboard, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { colors } from '../../lib/Settings';
import { showToast } from '../../lib/toast';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectHaptics, selectTheme } from '../../redux/settings/settings.selectors';
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-tiny-toast';

// Menu that displays "new game" or "Join game" options
const PlayerMenu = ({
  setTextInput,
  styles,
  textInput,
  handleInputChange,
  handleNewGame,
  handleJoinGame,
  theme,
  hapticsEnabled
}) => {
  const insertFromClipboard = async () => {
    const text = await Clipboard.getString();
    showToast('Inserted text from Clipboard')
    setTextInput((prevState) => ({ ...prevState, value: text }));
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success');
  };

  const clearInput = () => {
    setTextInput((prevState) => ({ ...prevState, value: '' }))
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    Toast.hide()
  }

  return (
    <View>
      <Button onPress={() => {
        handleNewGame()
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
      }}
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
        selectionColor={theme === 'dark' ? colors.dark.main : colors.light.main}
        underlineColorAndroid={theme === 'dark' ? colors.dark.main : colors.light.main}
        placeholder="Enter lobby id"
        placeholderTextColor="lightgrey"
        autoCapitalize="none"
        underlineColorAndroid='transparent'
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <TouchableOpacity onPress={insertFromClipboard}>
          <MaterialCommunityIcons
            color={theme === 'dark' ? colors.dark.text : colors.light.text}
            name='clipboard-text-outline'
            size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearInput} disabled={!Boolean(textInput.value.length)}>
          <MaterialCommunityIcons
            color={!Boolean(textInput.value.length) ? 'grey' : theme === 'dark' ? colors.dark.text : colors.light.text}
            name='backspace-outline'
            size={30} />
        </TouchableOpacity>
      </View>

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

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps)(PlayerMenu)
