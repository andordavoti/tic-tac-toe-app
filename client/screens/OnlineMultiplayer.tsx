import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, urls, calcFromHeight, IS_WEB, IS_IOS } from '../lib/constants';
import { getConnectedPlayers } from '../lib/playerUtils';
import PlayerMenu from '../components/Online/PlayerMenu';
import withSpinner from '../components/withSpinner';
import GameLoader from '../components/Online/GameLoader';
import { useDispatch } from 'react-redux';
import { ThemeMode } from '../types/Theme';
import { handleError } from '../lib/handleError';
import { GridNumber, GridString } from '../types/Game';
import { showErrorToast } from '../lib/toast';
import { useHapticsEnabled, useSelectedTheme } from '../redux/settingsSlice';
import { setLobbyId, setPlayerId, useLobbyId } from '../redux/gameSlice';
import { getLobbyDocRef } from '../lib/firebase/firestore';

// Wrapping gamecanvas and playermenu in the spinner HOC component
const PlayerMenuWithSpinner = withSpinner(PlayerMenu);

const OnlineMultiplayer: React.FC = () => {
    const [textInput, setTextInput] = useState('');
    const [gridSize, setGridSize] = useState<GridNumber>(3);
    const [connected, setConnected] = useState(false);

    const theme = useSelectedTheme();
    const hapticsEnabled = useHapticsEnabled();
    const lobbyId = useLobbyId();

    const dispatch = useDispatch();

    useEffect(() => {
        let unsubscribe: any;
        if (!IS_WEB) {
            unsubscribe = NetInfo.addEventListener(state => {
                setConnected(state.isConnected);
            });
        }
        return () => {
            if (!IS_WEB) {
                unsubscribe();
            }
        };
    }, []);

    const { height } = useWindowDimensions();

    const styles = getStyleSheet(theme, height);

    const [loading, setLoading] = useState(false);
    const handleNewGame = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${urls.gameUrl}/new`, {
                method: 'POST',
                body: JSON.stringify({ gameSize: gridSize }),
            });

            const data = await response.json();

            dispatch(setPlayerId(0));
            dispatch(setLobbyId(data.lobbyId));
        } catch (err) {
            handleError(err);
        }
        setLoading(false);
    };

    const handleJoinGame = async () => {
        try {
            // Fetching lobby from text input
            const snapshot = getLobbyDocRef(textInput);
            const lobbyExists = (await snapshot.get()).exists;

            // Checking if lobby exists
            if (!lobbyExists) {
                if (IS_IOS && hapticsEnabled) {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error
                    );
                }
                showErrorToast('This lobby does not exist...');
                return;
            }

            const players = (await snapshot.get()).data().players;
            const connectedPlayers = getConnectedPlayers(players);
            const playerId = players[0].connected
                ? 1
                : players[1].connected
                ? 0
                : 0;

            if (connectedPlayers.length >= 2) {
                if (IS_IOS && hapticsEnabled) {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error
                    );
                }
                showErrorToast('Lobby is full...');
                return;
            }

            dispatch(setPlayerId(playerId));
            dispatch(setLobbyId(textInput));
            if (IS_IOS && hapticsEnabled)
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
        } catch (err) {
            handleError(err);
        }
    };

    const handleInputChange = (text: string) => setTextInput(text);

    const handleGridSizeChange = (value: GridString) => {
        if (value) {
            if (IS_IOS && hapticsEnabled) Haptics.selectionAsync();
            setGridSize(Number(value) as GridNumber);
        }
    };

    if (connected || IS_WEB) {
        return (
            <View style={styles.container}>
                {lobbyId ? (
                    <GameLoader styles={styles} />
                ) : (
                    //No nested if, loading state passed directly to component
                    <PlayerMenuWithSpinner
                        msg="Connecting to game server"
                        loading={loading}
                        {...{
                            setTextInput,
                            styles,
                            textInput,
                            gridSize,
                            setGridSize,
                            handleGridSizeChange,
                            handleInputChange,
                            handleNewGame,
                            handleJoinGame,
                        }}
                    />
                    //No nested if, loading state passed directly to component
                )}
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <MaterialCommunityIcons
                    color={colors[theme].text}
                    name="wifi-strength-alert-outline"
                    size={30}
                />
                <Text style={styles.text}>
                    Please check your{'\n'}network connection!
                </Text>
            </View>
        );
    }
};

const getStyleSheet = (theme: ThemeMode, height: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors[theme].bg,
        },
        joinText: {
            color: colors[theme].text,
            marginTop: calcFromHeight(15, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
        text: {
            color: colors[theme].text,
            margin: calcFromHeight(8, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
        lobbyId: {
            color: colors[theme].text,
            marginTop: calcFromHeight(15, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        infoText: {
            color: colors[theme].warning,
            margin: calcFromHeight(5, height),
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        button: {
            width: 200,
            margin: calcFromHeight(8, height),
            backgroundColor: colors[theme].main,
        },
        buttonGroup: {
            backgroundColor: colors[theme].main,
        },
        buttonGroupSelected: {
            backgroundColor: colors[theme].text,
        },
        quitButton: {
            margin: calcFromHeight(8, height),
            marginBottom: calcFromHeight(20, height),
            backgroundColor: colors[theme].main,
        },
        input: {
            color: 'white',
            textAlign: 'center',
            backgroundColor: colors[theme].disabledButton,
            height: 40,
            width: 200,
            margin: calcFromHeight(8, height),
            borderRadius: 5,
            borderColor: colors[theme].main,
            fontSize: 20,
        },
    });
};

export default OnlineMultiplayer;
