import React from 'react'
import { View } from 'react-native'
import Column from './Column';

const Grid = ({ fieldTypes, size, handlePress, tied, winnerColumns, canvasFrozen }) => {

    const sizeArray = [...Array(size).keys()]

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

    return <View>
        {sizeArray.map(x => (
            <View style={{ flexDirection: 'row' }} key={x}>
                {sizeArray.map(y => (
                    <Column
                        key={y}
                        action={handlePress}
                        num={getNum()}
                        fieldTypes={fieldTypes}
                        winnerColumns={winnerColumns}
                        disableFields={canvasFrozen || Boolean(winnerColumns.length) || tied}
                    />
                ))}
            </View>
        ))}
    </View>
}

export default Grid