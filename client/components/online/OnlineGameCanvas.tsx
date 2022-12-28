import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useDimensions } from '@react-native-community/hooks';

import { colors, calcFromHeight } from '../../lib/constants';
import { firestore } from '../../lib/firebaseUtils';
import { selectLobbyId, selectGame } from '../../redux/game/game.selectors';
import {
    selectHaptics,
    selectTheme,
} from '../../redux/settings/settings.selectors';
import { useSelector } from 'react-redux';
import {
    getFieldType,
    checkGame,
    getPlayerName,
} from '../../lib/gameCanvasUtils';
import Grid from '../Grid';
import CountdownTimer from '../CountdownTimer';
import { ThemeMode } from '../../types/Theme';
import { Winner, WinnerColumns } from '../../types/Game';
import { handleError } from '../../lib/handleError';

interface WinnerState {
    winner: Winner;
    tied: boolean;
    winnerColumns: WinnerColumns;
}

const initialState = {
    winner: null,
    tied: false,
    winnerColumns: [],
};

const OnlineGameCanvas: React.FC = () => {
    const lobbyId = useSelector(selectLobbyId);
    const gameState = useSelector(selectGame);
    const theme = useSelector(selectTheme);
    const hapticsEnabled = useSelector(selectHaptics);

    const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[] | []>(
        []
    );
    const [winnerDetails, setWinnerDetails] =
        useState<WinnerState>(initialState);
    const { winner, winnerColumns, tied } = winnerDetails;
    const { fieldTypes, playerId, xIsNext, gameStarted, gameSize, resetable } =
        gameState;
    const timeOutDuration = 10000;

    const { height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

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
                    resetable: false,
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
                    resetable: true,
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

    const changeTurn = async () => {
        try {
            const docRef = firestore.collection('lobbies').doc(lobbyId);

            await docRef.set(
                {
                    xIsNext: xIsNext === 1 ? 0 : 1,
                },
                { merge: true }
            );
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        resetable && setWinnerDetails(initialState);
    }, [resetable]);

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
                    changeTurn();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldTypes]);

    const renderTimer = () => {
        if (timers.length && gameStarted) {
            return <CountdownTimer key={xIsNext} duration={timeOutDuration} />;
        }
    };

    return (
        <View style={styles.container}>
            {renderTimer()}
            {!(Boolean(winner) || tied) && (
                <Text style={styles.text}>
                    {playerId === xIsNext
                        ? 'Your turn'
                        : `Player ${getPlayerName(xIsNext)} picking`}
                </Text>
            )}
            {(Boolean(winner) || tied) && (
                <View>
                    <Text style={styles.gameOverText}>
                        {winner
                            ? winner === getFieldType(playerId)
                                ? 'You won'
                                : 'You lost'
                            : "It's a tie"}
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
            )}
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

const getStyleSheet = (theme: ThemeMode, height: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        gameOverText: {
            color: colors[theme].text,
            margin: calcFromHeight(15, height),
            fontSize: 30,
            textAlign: 'center',
            fontWeight: '500',
        },
        winnerText: {
            color: colors[theme].text,
            margin: calcFromHeight(15, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        text: {
            color: colors[theme].text,
            marginTop: calcFromHeight(15, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: calcFromHeight(15, height),
        },
        button: {
            marginBottom: calcFromHeight(15, height),
            backgroundColor: colors[theme].main,
        },
    });
};

export default OnlineGameCanvas;
