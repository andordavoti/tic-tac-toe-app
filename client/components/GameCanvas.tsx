import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FieldTypes, Winner, GridNumber, WinnerColumns } from '../types/Game';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { checkGame } from '../lib/gameCanvasUtils';
import { colors } from '../lib/constants';
import { useSelector } from 'react-redux';
import {
    selectHaptics,
    selectTheme,
} from '../redux/settings/settings.selectors';
import { gridSizeDropdownItems } from '../lib/dropdownItems';
import Grid from './Grid';
import Dropdown from './Dropdown';
import { ThemeMode } from '../types/Theme';

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

    const styles = getStyleSheet(theme);

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
    }, [gameStart]);

    useEffect(() => {
        if (fieldTypes.length > 0) {
            const result = checkGame(fieldTypes, gridSize);

            if ((result.winner || result.tied) && !winner && !tied) {
                setGameState({
                    ...gameState,
                    winner: result.winner,
                    tied: result.tied,
                    winnerColumns: result.winnerColumns,
                    canvasFrozen: true,
                });
            }
        }
    }, [gameState]);

    const onValueChange = (type: string, value: GridNumber) => {
        if (type === 'setGridSize') {
            setGameState({
                ...gameState,
                gridSize: value,
            });
        }
    };

    const renderInfo = () => {
        let winnerOutput = null;

        if (tied)
            winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>;
        else
            winnerOutput = (
                <Text style={styles.winnerText}>
                    The winner is {winner && winner.toUpperCase()}
                </Text>
            );

        if (canvasFrozen && (winner || tied)) {
            Haptics.notificationAsync('success' as any);
            return (
                <View>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    {winnerOutput}
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
                    <View style={{ width: 130, alignSelf: 'center' }}>
                        <Dropdown
                            label="Grid Size:"
                            textStyle={styles.text}
                            value={gridSize}
                            onValueChange={onValueChange}
                            type="setGridSize"
                            placeholder={{
                                label: 'Select Grid Size',
                                value: null,
                                color: '#9EA0A4',
                            }}
                            items={gridSizeDropdownItems}
                        />
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
            fontWeight: '400',
        },
        button: {
            margin: 20,
            marginBottom: 40,
            backgroundColor: colors[theme].main,
        },
        text: {
            color: colors[theme].text,
            margin: 20,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
    });
};

export default GameCanvas;
