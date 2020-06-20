import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { View, StyleSheet, Text, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, urls, calcFromHeight } from '../lib/constants';
import { firestore, getConnectedPlayers } from '../lib/firebaseUtils';
import PlayerMenu from '../components/online/PlayerMenu';
import withSpinner from '../components/withSpinner';
import GameLoader from '../components/online/GameLoader';
// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectPlayerId, selectLobbyId } from '../redux/game/game.selectors';
import { setLobbyId, setPlayerId } from '../redux/game/game.actions';
import {
    selectHaptics,
    selectTheme,
} from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';
import { handleError } from '../lib/handleError';
import { GridString } from '../types/Game';
import { useDimensions } from '@react-native-community/hooks';

// Wrapping gamecanvas and playermenu in the spinner HOC component
const PlayerMenuWithSpinner = withSpinner(PlayerMenu);

interface Props {
    lobbyId: string;
    playerId: number;
    setLobbyId: (e: string) => void;
    setPlayerId: (e: number) => void;
    theme: ThemeMode;
    hapticsEnabled: boolean;
}

const OnlineMultiplayer: React.FC<Props> = ({
    lobbyId,
    playerId,
    setLobbyId,
    setPlayerId,
    theme,
    hapticsEnabled,
}) => {
    const [textInput, setTextInput] = useState<{
        value: string;
        err: string;
    }>({
        value: '',
        err: '',
    });
    const [gridSize, setGridSize] = useState(3);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        let unsubscribe: any;
        if (Platform.OS !== 'web') {
            unsubscribe = NetInfo.addEventListener(state => {
                setConnected(state.isConnected);
            });
        }
        return () => {
            if (Platform.OS !== 'web') {
                unsubscribe();
            }
        };
    }, []);

    const { width, height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

    const [loading, setLoading] = useState(false);
    const handleNewGame = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                method: 'POST',
                url: `${urls.gameUrl}/new`,
                data: { gameSize: gridSize },
            });

            const { data } = response;

            setPlayerId(0);
            setLobbyId(data.lobbyId);
        } catch (err) {
            handleError(err);
        }
        setLoading(false);
    };

    const handleJoinGame = async () => {
        try {
            // Fetching lobby from text input
            const snapshot = await firestore
                .collection('lobbies')
                .doc(textInput.value)
                .get();

            // Checking if lobby exists
            if (!snapshot.exists) {
                if (Platform.OS === 'ios' && hapticsEnabled)
                    Haptics.notificationAsync('error' as any);
                return setTextInput({
                    ...textInput,
                    err: 'This lobby does not exist...',
                });
            }

            const players = snapshot?.data()?.players;
            const connected = getConnectedPlayers(players);
            const playerId = players[0].connected
                ? 1
                : players[1].connected
                ? 0
                : 0;

            if (connected.length >= 2) {
                if (Platform.OS === 'ios' && hapticsEnabled)
                    Haptics.notificationAsync('error' as any);
                return setTextInput({ ...textInput, err: 'Lobby is full...' });
            }

            setPlayerId(playerId);
            setLobbyId(textInput.value);
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('success' as any);
        } catch (err) {
            handleError(err);
        }
    };

    const handleInputChange = (text: string) =>
        setTextInput({ ...textInput, value: text });

    const handleGridSizeChange = (value: GridString) => {
        if (value) {
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.selectionAsync();
            setGridSize(Number(value));
        }
    };

    if (connected || Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                {lobbyId ? (
                    <GameLoader
                        styles={styles}
                        playerId={playerId}
                        lobbyId={lobbyId}
                    />
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

const mapStateToProps = createStructuredSelector<any, any>({
    playerId: selectPlayerId,
    lobbyId: selectLobbyId,
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
});

const actions = {
    setLobbyId,
    setPlayerId,
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

export default connect(mapStateToProps, actions)(OnlineMultiplayer);
