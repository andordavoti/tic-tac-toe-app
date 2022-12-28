import React, { useEffect, useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    firestore,
    modifyPlayer,
    getConnectedPlayers,
} from '../../lib/firebaseUtils';
import { getPlayerName } from '../../lib/gameCanvasUtils';
import withSpinner from '../withSpinner';
import {
    setGameStateChange,
    setGameLoaded,
    quitGame,
} from '../../redux/game/game.actions';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import { selectGame } from '../../redux/game/game.selectors';
import OnlineGameCanvas from './OnlineGameCanvas';
import { showToast } from '../../lib/toast';
import {
    selectHaptics,
    selectTheme,
} from '../../redux/settings/settings.selectors';

import { useDimensions } from '@react-native-community/hooks';
import { colors, calcFromWidth, calcFromHeight } from '../../lib/constants';
import { LobbyId, PlayerId, FieldTypes } from '../../types/Game';
import { handleError } from '../../lib/handleError';
import { GameState } from '../../redux/game/game.reducer';

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

interface Game {
    lobbyId: LobbyId;
    playerId: PlayerId;
    xIsNext: number;
    fieldTypes: FieldTypes;
    players: Player[];
    gameLoaded: boolean;
}

interface Props {
    styles: Styles;
}

const GameLoader: React.FC<Props> = ({ styles }) => {
    const theme = useSelector(selectTheme);
    const hapticsEnabled = useSelector(selectHaptics);
    const game = useSelector(selectGame);

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

    const showError = () => {
        showToast('Could not connect to game server');
        dispatch(quitGame());
    };

    useEffect(() => {
        game.gameLoaded && connectPlayer();
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
        showToast('Copied Lobby ID to Clipboard');
        Clipboard.setString(lobbyId);
        if (Platform.OS === 'ios' && hapticsEnabled) {
            Haptics.notificationAsync('success' as any);
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
