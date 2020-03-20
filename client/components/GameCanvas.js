import * as React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import * as Haptics from 'expo-haptics'

import { colors } from '../lib/Settings'
import Column from './Column'

class GameCanvas extends React.Component {

    state = {
        //TODO: generate fieldtype array dynamically from the size prop in component did mount (Math.pow(size, 2) to generate the length)
        fieldType: ['', '', '', '', '', '', '', '', ''],
        turn: 'o',
        disableFields: false,
        winnerColumns: [],
        winner: '',
        gameStart: false
    }

    componentDidUpdate(prevState) {
        const { fieldType, disableFields, gameStart } = this.state
        const { size } = this.props

        //check if all fields are pressed
        if (prevState.fieldType !== fieldType) {
            let counter = 0
            for (let i = 0; i < fieldType.length; i++) if (fieldType[i] !== '') counter++
            if (counter === Math.pow(size, 2) && !disableFields) this.setState({ disableFields: true, winner: 'tied' })
            if (counter !== 0 && !gameStart) this.setState({ gameStart: true })
        }
    }

    renderInfo = () => {
        const { disableFields, winner, gameStart } = this.state
        let winnerOutput = ''

        if (winner === 'tied') winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>
        else winnerOutput = <Text style={styles.winnerText}>The winner is {winner.toUpperCase()}</Text>

        if (disableFields && winner !== '') {
            return <View>
                <Text style={styles.gameOverText}>Game Over</Text>
                {winnerOutput}
                <Button
                    title="New Game"
                    type='solid'
                    buttonStyle={styles.button}
                    onPress={() => {
                        if (Platform.OS === 'ios') Haptics.selectionAsync()
                        this.setState({
                            fieldType: ['', '', '', '', '', '', '', '', ''],
                            disableFields: false,
                            winnerColumns: [],
                            gameStart: false
                        })
                    }
                    }
                />
            </View>
        }
        else if (!gameStart) return <Text style={styles.winnerText}>Press a column to start the game</Text>
    }

    checkLine = (user, combination) => {
        const { fieldType } = this.state

        if (fieldType[combination[0]] === user && fieldType[combination[1]] === user && fieldType[combination[2]] === user) {
            if (Platform.OS === 'ios') Haptics.notificationAsync('success')
            this.setState({ winner: user, disableFields: true, winnerColumns: [combination[0], combination[1], combination[2]] })
        }
    }

    checkGame = (forUser) => {
        const winnerCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

        for (let i = 0; i < winnerCombinations.length; i++) this.checkLine(forUser, winnerCombinations[i])
    }

    pressed = (num) => {
        let fieldType = this.state.fieldType,
            turn = this.state.turn

        if (fieldType[num] === '') {
            if (Platform.OS === 'ios') Haptics.selectionAsync()

            if (turn === 'o') fieldType[num] = 'o'
            else fieldType[num] = 'x'

            this.checkGame(turn)

            if (turn === 'o') this.setState({ fieldType, turn: 'x' })
            if (turn === 'x') this.setState({ fieldType, turn: 'o' })
        }
        else if (Platform.OS === 'ios') Haptics.notificationAsync('error')
    }

    getNum = (y, x) => {

        //TODO: create an algorithm from this pattern (this may not be correct, I don't think the width is accounted for in this pattern)
        if (x === 1) {
            return x + y - 2
        }
        if (x === 2) {
            return x + y
        }
        if (x === 3) {
            return x + y + 2
        }
        if (x === 4) {
            return x + y + 4
        }
        if (x === 5) {
            return x + y + 6
        }
    }

    renderGrid = () => {
        //TODO: dynamically make an array of size, like if size would be 3, then the output array should be [1, 2, 3, ...]
        const { size } = this.props
        const sizeArray = [1, 2, 3]

        return <View>
            {
                sizeArray.map(x => (
                    <View style={{ flexDirection: 'row' }} key={x}>
                        {
                            sizeArray.map(y => <Column key={y}
                                action={this.pressed}
                                num={this.getNum(x, y)}
                                {...this.state}
                            />)
                        }
                    </View>
                ))
            }
        </View>
    }

    render() {
        return <View style={styles.container}>
            <View>
                {this.renderInfo()}
            </View>
            {this.renderGrid()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameOverText: {
        color: 'white',
        margin: 20,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '500'
    },
    winnerText: {
        color: 'white',
        margin: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    button: {
        margin: 20,
        marginBottom: 40,
        backgroundColor: colors.main
    }
})

export default GameCanvas