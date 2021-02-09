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
    setLobbyId,
    quitGame,
} from '../../redux/game/game.actions';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Clipboard from 'expo-clipboard';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectGame } from '../../redux/game/game.selectors';
import OnlineGameCanvas from './OnlineGameCanvas';
import { showToast } from '../../lib/toast';
import {
    selectHaptics,
    selectTheme,
} from '../../redux/settings/settings.selectors';

import { useDimensions } from '@react-native-community/hooks';
import { colors, calcFromWidth, calcFromHeight } from '../../lib/constants';
import { ThemeMode } from '../../types/Theme';
import { LobbyId, PlayerId, FieldTypes } from '../../types/Game';
import { handleError } from '../../lib/handleError';

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

interface SetGameArg {
    lobbyId: string;
    //...snapshot.data() TODO: what's this type?
}

interface Props {
    styles: Styles;
    game: Game;
    setGameLoaded: (e: SetGameArg) => void;
    setGameStateChange: (e: SetGameArg) => void;
    quitGame: () => void;
    theme: ThemeMode;
    hapticsEnabled: boolean;
}

const GameLoader: React.FC<Props> = ({
    styles,
    game,
    setGameLoaded,
    setGameStateChange,
    quitGame,
    theme,
    hapticsEnabled,
}) => {
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

            quitGame();
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
        quitGame();
    };

    useEffect(() => {
        game.gameLoaded && connectPlayer();
    }, [game.gameLoaded]);

    useEffect(() => {
        const docRef = firestore.collection('lobbies').doc(lobbyId);
        let initial = true;
        const channel = docRef.onSnapshot(
            snapshot => {
                if (!snapshot.exists) return showError();

                if (initial) {
                    setGameLoaded({ lobbyId, ...snapshot.data() });
                    initial = false;
                    return;
                }
                setGameStateChange({ lobbyId, ...snapshot.data() });
            },
            err => {
                showError();
            }
        );

        return () => {
            disconnectPlayer();
            channel();
        };
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

const mapStateToProps = createStructuredSelector<any, any>({
    game: selectGame,
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
});

const actions = {
    setGameStateChange,
    setGameLoaded,
    setLobbyId,
    quitGame,
};

export default connect(mapStateToProps, actions)(GameLoader);
