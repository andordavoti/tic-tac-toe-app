import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Clipboard, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { colors } from '../../lib/constants';
import { showToast } from '../../lib/toast';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectHaptics, selectTheme } from '../../redux/settings/settings.selectors';
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-tiny-toast';
import Dropdown from '../Dropdown';
import { gridSizeDropdownItems } from '../../lib/dropdownItems';

interface Styles {
  text: object
  button: object
  joinText: object
  input: object
  infoText: object
}

interface TextInput {
  value: string
  err: string
}

interface Props {
  styles: Styles
  textInput: TextInput
  setTextInput;
  handleInputChange;
  gridSize: 3 | 4
  handleDropdownChange: () => void
  handleNewGame;
  handleJoinGame;
  theme: 'light' | 'dark'
  hapticsEnabled: boolean
}

// Menu that displays "new game" or "Join game" options
const PlayerMenu: React.FC<Props> = ({
  styles,
  textInput,
  setTextInput,
  handleInputChange,
  gridSize,
  handleDropdownChange,
  handleNewGame,
  handleJoinGame,
  theme,
  hapticsEnabled
}) => {
  const insertFromClipboard = async () => {
    const text = await Clipboard.getString();
    showToast('Inserted text from Clipboard')
    setTextInput((prevState: TextInput) => ({ ...prevState, value: text }));
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success' as any);
  };

  const clearInput = () => {
    setTextInput((prevState: TextInput) => ({ ...prevState, value: '' }))
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    Toast.hide
  }

  return (
    <View>
      <View style={{ width: 130, alignSelf: 'center' }}>
        <Dropdown
          label='Grid Size:'
          textStyle={styles.text}
          value={gridSize}
          onValueChange={handleDropdownChange}
          type='setGridSize'
          placeholder={{ label: 'Select Grid Size', value: null, color: '#9EA0A4' }}
          items={gridSizeDropdownItems} />
      </View>
      <Button onPress={() => {
        handleNewGame()
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
      }}
        mode="contained"
        style={styles.button}
        labelStyle={{ color: 'white' }}
        contentStyle={{ margin: 10 }}>
        New Game
      </Button>
      <Text style={styles.joinText}>Join Game:</Text>

      <TextInput
        style={styles.input}
        value={textInput.value}
        onChangeText={handleInputChange}
        keyboardAppearance="dark"
        selectionColor={colors[theme].main}
        placeholder="Enter lobby id"
        placeholderTextColor="lightgrey"
        autoCapitalize="none"
        underlineColorAndroid='transparent'
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <TouchableOpacity onPress={insertFromClipboard}>
          <MaterialCommunityIcons
            color={colors[theme].text}
            name='clipboard-text-outline'
            size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearInput} disabled={!Boolean(textInput.value.length)}>
          <MaterialCommunityIcons
            color={!Boolean(textInput.value.length) ? 'grey' : colors[theme].text}
            name='backspace-outline'
            size={30} />
        </TouchableOpacity>
      </View>

      {Boolean(textInput.err.length) && <Text style={styles.infoText}>{textInput.err}</Text>}

      <Button
        disabled={!textInput.value.length}
        onPress={handleJoinGame}
        mode="contained"
        style={textInput.value.length ? styles.button : { ...styles.button, backgroundColor: 'grey' }}
        labelStyle={{ color: 'white' }}
        contentStyle={{ margin: 10 }}>
        Join
      </Button>
    </View>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps)(PlayerMenu)
