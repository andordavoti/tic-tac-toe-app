import React from 'react'
import { View } from 'react-native'
import Column from './Column';

interface Props {
    fieldTypes: null[] | string[]
    gridSize: 3 | 4
    handlePress: Function
    tied: boolean
    winner: 'x' | 'o' | null
    winnerColumns: null[] | number[]
    canvasFrozen: boolean
}

const Grid: React.FC<Props> = ({ fieldTypes, gridSize, handlePress, tied, winner, winnerColumns, canvasFrozen }) => {

    const sizeArray = [...Array(gridSize).keys()]

    let num = 0
    let initial = true
    const getNum = () => {
        if (initial) {
            initial = false
            return num
        }
        num++
        return num
    }

    return <View style={{ alignItems: 'center', justifyContent: 'center' }} >
        {sizeArray.map(x => (
            <View style={{ flexDirection: 'row' }} key={x}>
                {sizeArray.map(y => (
                    <Column
                        key={y}
                        action={handlePress}
                        num={getNum()}
                        {...{ tied, winner, fieldTypes, winnerColumns, gridSize }}
                        disableFields={canvasFrozen || Boolean(winnerColumns.length) || tied}
                    />
                ))}
            </View>
        ))}
    </View>
}

export default Grid