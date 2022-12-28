import React, { useEffect, useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    firestore,
    modifyPlayer,
    getConnectedPlayers,
} from '../../lib/firebaseUtils';
import { getPlayerName } from '../../lib/gameCanvasUtils';
import withSpinner from '../withSpinner';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useDispatch } from 'react-redux';
import OnlineGameCanvas from './OnlineGameCanvas';

import { useDimensions } from '@react-native-community/hooks';
import { colors, calcFromWidth, calcFromHeight } from '../../lib/constants';
import { handleError } from '../../lib/handleError';
import { showErrorToast, showInfoToast } from '../../lib/toast';
import { useHapticsEnabled, useSelectedTheme } from '../../redux/settingsSlice';
import {
    GameState,
    quitGame,
    setGameLoaded,
    setGameStateChange,
    useGame,
} from '../../redux/gameSlice';

const GameCanvasWithSpinner = withSpinner(OnlineGameCanvas);

interface Styles {
    joinText: object;
    lobbyId: object;
    text: object;
    quitButton: object;
}

interface Player {
    connected: boolean;
    id: string;
}

interface Props {
    styles: Styles;
}

const GameLoader: React.FC<Props> = ({ styles }) => {
    const theme = useSelectedTheme();
    const hapticsEnabled = useHapticsEnabled();
    const game = useGame();

    const dispatch = useDispatch();

    const { playerId, lobbyId } = game;

    const { width, height } = useDimensions().window;

    const disconnectPlayer = async () => {
        try {
            const docRef = firestore.collection('lobbies').doc(lobbyId);
            const getGameState = await docRef.get();

            const gamePlayers = getGameState.data()?.players as
                | Player[]
                | undefined;
            if (!gamePlayers) return;

            const players = modifyPlayer(gamePlayers, playerId, {
                connected: false,
            });

            await docRef.set({ players }, { merge: true });

            dispatch(quitGame());
        } catch (err) {
            showError();
            handleError(err);
        }
    };

    const showError = () => {
        showErrorToast('Could not connect to game server');
        dispatch(quitGame());
    };

    useEffect(() => {
        const connectPlayer = async () => {
            try {
                const docRef = firestore.collection('lobbies').doc(lobbyId);

                const players = modifyPlayer(game.players, playerId, {
                    connected: true,
                });
                await docRef.set({ players }, { merge: true });
            } catch (err) {
                showError();
                handleError(err);
            }
        };

        if (game.gameLoaded) connectPlayer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game.gameLoaded]);

    useEffect(() => {
        const docRef = firestore.collection('lobbies').doc(lobbyId);
        let initial = true;
        const channel = docRef.onSnapshot(snapshot => {
            if (!snapshot.exists) return showError();

            if (initial) {
                dispatch(
                    setGameLoaded({
                        lobbyId,
                        ...(snapshot.data() as GameState),
                        gameLoaded: true,
                    })
                );
                initial = false;
                return;
            }
            dispatch(
                setGameStateChange({
                    lobbyId,
                    ...snapshot.data(),
                } as GameState)
            );
        }, showError);

        return () => {
            disconnectPlayer();
            channel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId]);

    const connectedPlayers = useMemo(() => {
        const result = game.players ? getConnectedPlayers(game.players) : [];

        return result;
    }, [game.players]);

    const copyLobbyId = () => {
        showInfoToast('Copied Lobby ID to Clipboard');
        Clipboard.setString(lobbyId);
        if (Platform.OS === 'ios' && hapticsEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={styles.joinText}>Lobby ID:</Text>
                <TouchableOpacity onPress={copyLobbyId}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.lobbyId}> {lobbyId}</Text>
                        <MaterialCommunityIcons
                            color={colors[theme].text}
                            name="clipboard-text-outline"
                            style={{
                                marginLeft: calcFromWidth(2, width),
                                marginTop: calcFromHeight(12, height),
                            }}
                            size={30}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>
                You are player: {getPlayerName(playerId)}
            </Text>

            <GameCanvasWithSpinner
                msg="Waiting for other player..."
                loading={connectedPlayers.length < 2}
            />
            <Button
                mode="contained"
                style={styles.quitButton}
                labelStyle={{ color: 'white' }}
                onPress={() => {
                    if (Platform.OS === 'ios' && hapticsEnabled)
                        Haptics.selectionAsync();
                    disconnectPlayer();
                }}
            >
                Quit Game
            </Button>
        </>
    );
};

export default GameLoader;
