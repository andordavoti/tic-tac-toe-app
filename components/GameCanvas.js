import * as React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import * as Haptics from 'expo-haptics'

import { colors } from '../lib/Settings'
import Column from './Column'

class GameCanvas extends React.Component {

    state = {
        fieldType: ['', '', '', '', '', '', '', '', ''],
        turn: 'o',
        disableFields: false,
        winnerColumns: [],
        winner: '',
        gameStart: false
    }

    componentDidUpdate(prevState) {
        const { fieldType, disableFields, gameStart } = this.state

        //check if all fields are pressed
        if (prevState.fieldType !== fieldType) {
            let counter = 0
            for (let i = 0; i < fieldType.length; i++) if (fieldType[i] !== '') counter++
            if (counter === 9 && !disableFields) this.setState({ disableFields: true, winner: 'tied' })
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
                    onPress={() => this.setState({
                        fieldType: ['', '', '', '', '', '', '', '', ''],
                        disableFields: false,
                        winnerColumns: [],
                        gameStart: false
                    })}
                />
            </View>
        }
        else if (!gameStart) return <Text style={styles.winnerText}>Press a column to start the game</Text>
    }

    checkLine = (user, combination) => {
        const { fieldType } = this.state

        if (fieldType[combination[0]] === user && fieldType[combination[1]] === user && fieldType[combination[2]] === user) {
            if (Platform.OS === 'ios') Haptics.notificationAsync('success')
            this.setState({ winner: user, disableFields: true, winnerColumns: [combination[0] + 1, combination[1] + 1, combination[2] + 1] })
        }
    }

    checkGame = (forUser) => {
        const winnerCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

        for (let i = 0; i < winnerCombinations.length; i++) this.checkLine(forUser, winnerCombinations[i])
    }

    pressed = (num) => {
        let fieldType = this.state.fieldType,
            turn = this.state.turn

        if (fieldType[num - 1] === '') {
            if (Platform.OS === 'ios') Haptics.selectionAsync()

            if (turn === 'o') fieldType[num - 1] = 'o'
            else fieldType[num - 1] = 'x'

            this.checkGame(turn)

            if (turn === 'o') this.setState({ fieldType, turn: 'x' })
            if (turn === 'x') this.setState({ fieldType, turn: 'o' })
        }
        else if (Platform.OS === 'ios') Haptics.notificationAsync('error')
    }

    render() {
        const { fieldType, disableFields, winnerColumns } = this.state

        return <View style={styles.container}>
            <View>
                {this.renderInfo()}
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={1} fieldType={fieldType[0]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={4} fieldType={fieldType[3]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={7} fieldType={fieldType[6]} />
                </View>
                <View>
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={2} fieldType={fieldType[1]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={5} fieldType={fieldType[4]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={8} fieldType={fieldType[7]} />
                </View>
                <View>
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={3} fieldType={fieldType[2]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={6} fieldType={fieldType[5]} />
                    <Column winnerColumns={winnerColumns} disabled={disableFields} action={this.pressed} num={9} fieldType={fieldType[8]} />
                </View>
            </View>
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