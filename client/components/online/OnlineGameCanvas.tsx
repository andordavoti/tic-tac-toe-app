import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../../lib/constants';
import { firestore } from '../../lib/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import {
    selectLobbyId,
    selectFieldTypes,
    selectPlayerId,
    selectGame,
} from '../../redux/game/game.selectors';
import {
    selectHaptics,
    selectTheme,
} from '../../redux/settings/settings.selectors';
import { connect, useDispatch } from 'react-redux';
import {
    getFieldType,
    checkGame,
    getPlayerName,
} from '../../lib/gameCanvasUtils';
import { quitGame } from '../../redux/game/game.actions';
import { showToast } from '../../lib/toast';
import Grid from '../Grid';
import CountdownTimer from '../CountdownTimer';
import { ThemeMode } from '../../types/Theme';
import {
    FieldTypes,
    PlayerId,
    GridNumber,
    Winner,
    WinnerColumns,
    LobbyId,
} from '../../types/Game';
import { handleError } from '../../lib/handleError';

interface GameState {
    fieldTypes: FieldTypes;
    playerId: PlayerId;
    xIsNext: number;
    gameStarted: boolean;
    gameSize: GridNumber;
}

interface WinnerState {
    winner: Winner;
    tied: boolean;
    winnerColumns: WinnerColumns;
}

interface Props {
    gameState: GameState;
    lobbyId: LobbyId;
    hapticsEnabled: boolean;
    theme: ThemeMode;
}

const initialState = {
    winner: null,
    tied: false,
    winnerColumns: [],
};

const OnlineGameCanvas: React.FC<Props> = ({
    gameState,
    lobbyId,
    hapticsEnabled,
    theme,
}) => {
    const dispatch = useDispatch();
    const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[] | []>(
        []
    );
    const [winnerDetails, setWinnerDetails] = useState<WinnerState>(
        initialState
    );
    const { winner, winnerColumns, tied } = winnerDetails;
    const { fieldTypes, playerId, xIsNext, gameStarted, gameSize } = gameState;
    const timeOutDuration = 60000;
    const styles = getStyleSheet(theme);

    const canvasFrozen = playerId !== xIsNext;

    const handleFieldPress = async (num: number) => {
        try {
            if (canvasFrozen) return;
            const docRef = firestore.collection('lobbies').doc(lobbyId);

            const newFieldTypes = [...fieldTypes];

            newFieldTypes[num] = getFieldType(playerId);

            await docRef.set(
                {
                    gameStarted: true,
                    xIsNext: xIsNext === 0 ? 1 : 0,
                    fieldTypes: newFieldTypes,
                },
                { merge: true }
            );

            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.selectionAsync();
        } catch (err) {
            handleError(err);
        }
    };

    const resetLobby = async () => {
        try {
            const docRef = firestore.collection('lobbies').doc(lobbyId);

            await docRef.set(
                {
                    fieldTypes: Array(gameSize * gameSize).fill(null),
                    xIsNext: 0,
                },
                { merge: true }
            );
        } catch (err) {
            handleError(err);
        }
    };

    const handleNewGame = () => {
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
        resetLobby();
    };

    useEffect(() => {
        const result = checkGame(fieldTypes, gameSize);
        if (result?.winner && result.winnerColumns.length) {
            setWinnerDetails({
                ...winnerDetails,
                winner: result.winner,
                winnerColumns: result.winnerColumns,
            });
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('success' as any);
        } else if (winner) {
            setWinnerDetails(initialState);
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('error' as any);
        } else if (result?.tied) {
            setWinnerDetails({ ...initialState, tied: true });
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('error' as any);
        }

        if (!result) {
            timers.forEach(timer => {
                clearTimeout(timer);
                timers.shift();
            });

            const playerOnlineTimer = setTimeout(() => {
                if (gameStarted && (!winner || !result)) {
                    dispatch(quitGame());
                    showToast('Lobby dispanded due to inactivity', 3500);
                }
            }, timeOutDuration);

            setTimers([...timers, playerOnlineTimer]);
        }

        if (result || winner) {
            timers.forEach(timer => {
                timer && clearTimeout(timer);
                timers.shift();
            });
        }

        return () => {
            timers.forEach(timer => {
                timer && clearTimeout(timer);
                timers.shift();
            });
        };
    }, [fieldTypes]);

    return (
        <View style={styles.container}>
            {timers.length ? (
                <CountdownTimer size={48} duration={timeOutDuration} />
            ) : null}
            {!(Boolean(winner) || tied) ? (
                <Text style={styles.text}>
                    {playerId === xIsNext
                        ? 'Your turn'
                        : `Player ${getPlayerName(xIsNext)} picking`}
                </Text>
            ) : null}
            {Boolean(winner) || tied ? (
                <View>
                    <Text style={styles.gameOverText}>
                        {Boolean(winner)
                            ? winner === getFieldType(playerId)
                                ? 'You won'
                                : 'You lost'
                            : `It's a tie`}
                    </Text>
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={handleNewGame}
                    >
                        New Game
                    </Button>
                </View>
            ) : null}
            <Grid
                gridSize={gameSize}
                {...{
                    fieldTypes,
                    handlePress: handleFieldPress,
                    tied,
                    winner,
                    winnerColumns,
                    canvasFrozen,
                }}
            />
        </View>
    );
};

const mapStateToProps = createStructuredSelector<any, any>({
    lobbyId: selectLobbyId,
    playerId: selectPlayerId,
    fieldTypes: selectFieldTypes,
    gameState: selectGame,
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: ThemeMode) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        gameOverText: {
            color: colors[theme].text,
            margin: 20,
            fontSize: 30,
            textAlign: 'center',
            fontWeight: '500',
        },
        winnerText: {
            color: colors[theme].text,
            margin: 20,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        text: {
            color: colors[theme].text,
            marginTop: 20,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: 20,
        },
        button: {
            marginBottom: 40,
            backgroundColor: colors[theme].main,
        },
    });
};

export default connect(mapStateToProps)(OnlineGameCanvas);
