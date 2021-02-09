import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FieldTypes, Winner, GridNumber, WinnerColumns } from '../types/Game';
import { Button, ToggleButton } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { checkGame } from '../lib/gameCanvasUtils';
import { colors, calcFromHeight } from '../lib/constants';
import { useSelector } from 'react-redux';
import {
    selectHaptics,
    selectTheme,
} from '../redux/settings/settings.selectors';
import Grid from './Grid';
import { ThemeMode } from '../types/Theme';
import { useDimensions } from '@react-native-community/hooks';

interface GameCanvasState {
    fieldTypes: FieldTypes;
    turn: string;
    canvasFrozen: boolean;
    winnerColumns: WinnerColumns;
    gameStart: boolean;
    winner: Winner;
    tied: boolean;
    gridSize: GridNumber;
}

const GameCanvas: React.FC = () => {
    const theme = useSelector(selectTheme);
    const hapticsEnabled = useSelector(selectHaptics);

    const { height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

    const initialState = {
        fieldTypes: [],
        turn: 'o',
        canvasFrozen: false,
        winnerColumns: [],
        gameStart: false,
        winner: null,
        tied: false,
        gridSize: 3 as GridNumber,
    };

    const [gameState, setGameState] = useState<GameCanvasState>(initialState);

    const {
        fieldTypes,
        canvasFrozen,
        winnerColumns,
        gameStart,
        winner,
        tied,
        gridSize,
    } = gameState;

    const pressed = (num: number) => {
        if (!gameStart) {
            setGameState({
                ...gameState,
                gameStart: true,
            });
        }

        setGameState((prevState: GameCanvasState) => {
            const fieldTypesCopy = [...prevState.fieldTypes] as FieldTypes;
            fieldTypesCopy[num] = prevState.turn;

            return {
                ...prevState,
                fieldTypes: fieldTypesCopy,
                turn: prevState.turn === 'o' ? 'x' : 'o',
            };
        });
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    };

    useEffect(() => {
        if (!gameStart) {
            const fieldTypesArray = new Array(gridSize * gridSize);
            fieldTypesArray.fill(null);

            setGameState({
                ...gameState,
                fieldTypes: fieldTypesArray,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameStart]);

    useEffect(() => {
        if (fieldTypes.length > 0) {
            const result = checkGame(fieldTypes, gridSize);

            if ((result?.winner || result?.tied) && !winner && !tied) {
                setGameState({
                    ...gameState,
                    winner: result.winner,
                    tied: result.tied,
                    winnerColumns: result.winnerColumns,
                    canvasFrozen: true,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    const onValueChange = (value: string) => {
        if (value) {
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.selectionAsync();
            setGameState({
                ...gameState,
                gridSize: Number(value) as GridNumber,
            });
        }
    };

    const renderInfo = () => {
        if (canvasFrozen && (winner || tied)) {
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.notificationAsync('success' as any);
            return (
                <View>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    {tied ? (
                        <Text style={styles.winnerText}>It's a Tie</Text>
                    ) : (
                        <Text style={styles.winnerText}>
                            The winner is {winner && winner.toUpperCase()}
                        </Text>
                    )}
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={() => {
                            if (Platform.OS === 'ios' && hapticsEnabled)
                                Haptics.selectionAsync();
                            setGameState({ ...initialState, gridSize });
                        }}
                    >
                        New Game
                    </Button>
                </View>
            );
        } else if (!gameStart) {
            return (
                <>
                    <View>
                        <Text style={styles.text}>Grid Size:</Text>
                        <ToggleButton.Row
                            style={{ justifyContent: 'center' }}
                            onValueChange={onValueChange}
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
                    <Text style={styles.winnerText}>
                        Press a column to start the game
                    </Text>
                </>
            );
        } else return null;
    };

    return (
        <View style={styles.container}>
            <View>{renderInfo()}</View>
            <Grid
                handlePress={pressed}
                {...{
                    fieldTypes,
                    tied,
                    winner,
                    winnerColumns,
                    canvasFrozen,
                    gridSize,
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
            marginTop: calcFromHeight(10, height),
            marginBottom: calcFromHeight(15, height),
            fontSize: 30,
            textAlign: 'center',
            fontWeight: '500',
        },
        winnerText: {
            color: colors[theme].text,
            margin: calcFromHeight(10, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '400',
        },
        button: {
            margin: calcFromHeight(15, height),
            marginBottom: calcFromHeight(25, height),
            backgroundColor: colors[theme].main,
        },
        buttonGroup: {
            backgroundColor: colors[theme].main,
        },
        buttonGroupSelected: {
            backgroundColor: colors[theme].text,
        },
        text: {
            color: colors[theme].text,
            margin: calcFromHeight(10, height),
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
    });
};

export default GameCanvas;
