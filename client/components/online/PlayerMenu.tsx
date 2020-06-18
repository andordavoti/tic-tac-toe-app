import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Clipboard,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, ToggleButton } from 'react-native-paper';
import { colors, calcFromHeight, calcFromWidth } from '../../lib/constants';
import { showToast } from '../../lib/toast';
import { useSelector } from 'react-redux';
import {
    selectHaptics,
    selectTheme,
} from '../../redux/settings/settings.selectors';

import { useDimensions } from '@react-native-community/hooks';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-tiny-toast';
import { handleError } from '../../lib/handleError';
import { GridNumber } from '../../types/Game';

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
    const theme = useSelector(selectTheme);
    const hapticsEnabled = useSelector(selectHaptics);

    const { width, height } = useDimensions().window;

    const insertFromClipboard = async () => {
        try {
            const text = await Clipboard.getString();
            showToast('Inserted text from Clipboard');
            setTextInput((prevState: TextInputValues) => ({
                ...prevState,
                value: text,
            }));
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('success' as any);
        } catch (err) {
            handleError(err);
        }
    };

    const clearInput = () => {
        setTextInput((prevState: TextInputValues) => ({
            ...prevState,
            value: '',
        }));
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
        Toast.hide;
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
                        activeOpacity={0.6}
                        underlayColor={colors[theme].text}
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
                        activeOpacity={0.6}
                        underlayColor={colors[theme].text}
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
                        activeOpacity={0.6}
                        underlayColor={colors[theme].text}
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
                style={styles.input}
                value={textInput.value}
                onChangeText={handleInputChange}
                keyboardAppearance={theme}
                selectionColor={colors[theme].main}
                placeholder="Enter lobby id"
                placeholderTextColor="white"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
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
                            disabled={!Boolean(textInput.value.length)}
                        >
                            <MaterialCommunityIcons
                                color={
                                    !Boolean(textInput.value.length)
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

            {Boolean(textInput.err.length) && (
                <Text style={styles.infoText}>{textInput.err}</Text>
            )}

            <Button
                disabled={!textInput.value.length}
                onPress={handleJoinGame}
                mode="contained"
                style={
                    Boolean(textInput.value.length)
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

interface Styles {
    text: object;
    button: object;
    joinText: object;
    input: object;
    infoText: object;
    buttonGroupSelected: object;
    buttonGroup: object;
}

interface TextInputValues {
    value: string;
    err: string;
}

interface Props {
    styles: Styles;
    textInput: TextInputValues;
    setTextInput: any;
    handleInputChange: any;
    gridSize: GridNumber;
    handleGridSizeChange: () => void;
    handleNewGame: any;
    handleJoinGame: any;
}
