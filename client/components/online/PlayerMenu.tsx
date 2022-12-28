import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, ToggleButton } from 'react-native-paper';
import { colors, calcFromHeight, calcFromWidth } from '../../lib/constants';

import { useDimensions } from '@react-native-community/hooks';
import * as Haptics from 'expo-haptics';
import { handleError } from '../../lib/handleError';
import { GridNumber, GridString } from '../../types/Game';
import { showInfoToast } from '../../lib/toast';
import { useHapticsEnabled, useSelectedTheme } from '../../redux/settingsSlice';

interface Styles {
    text: object;
    button: object;
    joinText: object;
    input: object;
    infoText: object;
    buttonGroupSelected: object;
    buttonGroup: object;
}

interface Props {
    styles: Styles;
    textInput: string;
    setTextInput: (e: string) => void;
    handleInputChange: any;
    gridSize: GridNumber;
    handleGridSizeChange: (value: GridString) => void;
    handleNewGame: any;
    handleJoinGame: any;
}

// Menu that displays "new game" or "Join game" options
const PlayerMenu: React.FC<Props> = ({
    styles,
    textInput,
    setTextInput,
    handleInputChange,
    gridSize,
    handleGridSizeChange,
    handleNewGame,
    handleJoinGame,
}) => {
    const theme = useSelectedTheme();
    const hapticsEnabled = useHapticsEnabled();

    const { width, height } = useDimensions().window;

    const insertFromClipboard = async () => {
        try {
            const text = await Clipboard.getStringAsync();
            if (text.length) {
                showInfoToast('Inserted text from Clipboard');
                setTextInput(text);
                if (Platform.OS === 'ios' && hapticsEnabled)
                    Haptics.notificationAsync('success' as any);
            } else {
                showInfoToast('Clipboard is empty');
                if (Platform.OS === 'ios' && hapticsEnabled)
                    Haptics.notificationAsync('error' as any);
            }
        } catch (err) {
            handleError(err);
        }
    };

    const clearInput = () => {
        setTextInput('');
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    };

    return (
        <View>
            <View style={{ marginBottom: calcFromHeight(15, height) }}>
                <Text style={styles.text}>Grid Size:</Text>
                <ToggleButton.Row
                    style={{ justifyContent: 'center' }}
                    onValueChange={handleGridSizeChange}
                    value={gridSize.toString()}
                >
                    <ToggleButton
                        color={
                            gridSize === 3
                                ? colors[theme].bg
                                : colors[theme].text
                        }
                        style={
                            gridSize === 3
                                ? styles.buttonGroupSelected
                                : styles.buttonGroup
                        }
                        icon="numeric-3"
                        value="3"
                    />
                    <ToggleButton
                        color={
                            gridSize === 4
                                ? colors[theme].bg
                                : colors[theme].text
                        }
                        style={
                            gridSize === 4
                                ? styles.buttonGroupSelected
                                : styles.buttonGroup
                        }
                        icon="numeric-4"
                        value="4"
                    />
                    <ToggleButton
                        color={
                            gridSize === 5
                                ? colors[theme].bg
                                : colors[theme].text
                        }
                        style={
                            gridSize === 5
                                ? styles.buttonGroupSelected
                                : styles.buttonGroup
                        }
                        icon="numeric-5"
                        value="5"
                    />
                </ToggleButton.Row>
            </View>
            <Button
                onPress={() => {
                    handleNewGame();
                    if (Platform.OS === 'ios' && hapticsEnabled)
                        Haptics.selectionAsync();
                }}
                mode="contained"
                style={styles.button}
                labelStyle={{ color: 'white' }}
                contentStyle={{ margin: 10 }}
            >
                New Game
            </Button>

            <View
                style={{
                    marginLeft: calcFromWidth(10, width),
                    marginRight: calcFromWidth(10, width),
                    marginTop: calcFromHeight(10, height),
                    borderBottomColor: theme === 'dark' ? 'grey' : 'lightgrey',
                    borderBottomWidth: 2,
                }}
            />

            <Text style={styles.joinText}>Join Game:</Text>

            <TextInput
                style={[
                    styles.input,
                    Platform.OS === 'web' ? { outlineWidth: 0 } : null,
                ]}
                value={textInput}
                onChangeText={handleInputChange}
                keyboardAppearance={theme}
                selectionColor={colors[theme].main}
                placeholder="Enter lobby id"
                placeholderTextColor="white"
                autoCapitalize="none"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                returnKeyType="join"
                onSubmitEditing={handleJoinGame}
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                {Platform.OS !== 'web' ? (
                    <>
                        <TouchableOpacity onPress={insertFromClipboard}>
                            <MaterialCommunityIcons
                                color={colors[theme].text}
                                name="clipboard-text-outline"
                                size={30}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={clearInput}
                            disabled={!textInput.length}
                        >
                            <MaterialCommunityIcons
                                color={
                                    !textInput.length
                                        ? 'grey'
                                        : colors[theme].text
                                }
                                name="backspace-outline"
                                size={30}
                            />
                        </TouchableOpacity>
                    </>
                ) : null}
            </View>

            <Button
                disabled={!textInput.length}
                onPress={handleJoinGame}
                mode="contained"
                style={
                    textInput.length
                        ? styles.button
                        : [
                              styles.button,
                              { backgroundColor: colors[theme].disabledButton },
                          ]
                }
                labelStyle={{ color: 'white' }}
                contentStyle={{ margin: 10 }}
            >
                Join
            </Button>
        </View>
    );
};

export default PlayerMenu;
