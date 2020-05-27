import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../lib/constants';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';
import { FieldTypes, Winner, GridNumber, WinnerColumns } from '../types/Game';

interface Props {
    winnerColumns: WinnerColumns;
    num: number;
    disableFields: boolean;
    fieldTypes: FieldTypes;
    action: Function;
    tied: boolean;
    winner: Winner;
    gridSize: GridNumber;
}

const Column: React.FC<Props> = ({
    winnerColumns,
    num,
    disableFields,
    fieldTypes,
    action,
    tied,
    winner,
    gridSize,
}) => {
    const [isWinnerColumn, setIsWinnerColumn] = useState(false);
    const theme = useSelector(selectTheme);

    const size3 = Dimensions.get('window').width * 0.22;
    const size4 = Dimensions.get('window').height * 0.08;
    const size5 = Dimensions.get('window').height * 0.06;

    const styles = getStyleSheet(
        theme,
        gridSize,
        disableFields,
        size3,
        size4,
        size5
    );

    useEffect(() => {
        checkIfWinnerColumn();
    }, [winnerColumns]);

    const checkIfWinnerColumn = () => {
        if (
            (winnerColumns[0] === num ||
                winnerColumns[1] === num ||
                winnerColumns[2] === num ||
                winnerColumns[3] === num ||
                winnerColumns[4] === num) &&
            !isWinnerColumn
        ) {
            setIsWinnerColumn(true);
        } else if (winnerColumns) setIsWinnerColumn(false);
    };

    let icon;
    const currentFieldTypes = fieldTypes[num];

    if (currentFieldTypes === 'o') icon = 'circle-outline';
    else if (currentFieldTypes === 'x') icon = 'close';

    const size = gridSize === 3 ? 75 : gridSize === 4 ? 60 : 40; // making dynamic width height based on gridsize.
    return (
        <TouchableOpacity
            disabled={disableFields || Boolean(currentFieldTypes)}
            style={styles.column}
            onPress={() => {
                if (!currentFieldTypes)
                    action(num); /* TODO: Add an else with error haptics here */
            }}
        >
            {currentFieldTypes !== '' ? (
                <View style={styles.container}>
                    <View style={{ width: size, height: size }}>
                        <MaterialCommunityIcons
                            style={{ textAlign: 'center' }}
                            color={
                                !isWinnerColumn
                                    ? (winner || tied) && disableFields
                                        ? 'grey'
                                        : 'white'
                                    : colors[theme].main
                            }
                            name={icon}
                            size={size}
                        />
                    </View>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const getStyleSheet = (
    theme: ThemeMode,
    gridSize: GridNumber,
    disableFields: boolean,
    size3: number,
    size4: number,
    size5: number
) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        column: {
            width: gridSize === 5 ? size5 : gridSize === 4 ? size4 : size3,
            height: gridSize === 5 ? size5 : gridSize === 4 ? size4 : size3,
            backgroundColor: disableFields
                ? colors[theme].disabledColumn
                : colors[theme].main,
            borderRadius: 10,
            margin: 10,
        },
    });
};

export default Column;
