import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Haptics from 'expo-haptics';

import Column from './Column';

export default class GameCanvas extends React.Component {

    state = { fieldType: ['', '', '', '', '', '', '', '', ''], turn: 'o', disableFields: false, winnerColumns: [] };

    componentDidUpdate(prevState) {
        let { fieldType, disableFields } = this.state;

        //check if all fields are pressed
        if (prevState.fieldType !== fieldType) {
            let counter = 0;
            for (let i = 0; i < fieldType.length; i++) {
                if (fieldType[i] !== '') {
                    counter++
                }
            }
            if (counter === 9 && !disableFields) {
                //game is over
                this.setState({ disableFields: true }) 
            }
        }
    }

    checkGame = (forUser) => {
        let winnerCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for (let i = 0; i < winnerCombinations.length; i++) {
            this.checkLine(forUser, winnerCombinations[i]);
        }
    }

    checkLine = (user, combination) => {
        let { fieldType } = this.state;

        if (fieldType[combination[0]] === user && fieldType[combination[1]] === user && fieldType[combination[2]] === user) {
            console.log(user + ' has won');
            Haptics.notificationAsync('success');
            this.setState({ disableFields: true, winnerColumns:[ combination[0] + 1, combination[1] + 1, combination[2] + 1 ] })
        }
    }

    pressed = (num) => {
        let fieldType = this.state.fieldType;
        let turn = this.state.turn;

        if (fieldType[num - 1] === '') {
            Haptics.selectionAsync()

            if (turn === 'o') { fieldType[num - 1] = 'o' }
            else { fieldType[num - 1] = 'x' }

            this.checkGame(turn)

            if (turn === 'o') { this.setState({ fieldType, turn: 'x' }) }
            if (turn === 'x') { this.setState({ fieldType, turn: 'o' }) }
        }
        else {
            Haptics.notificationAsync('error');
        }
    }

    render() {
        let { fieldType, disableFields, winnerColumns } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 40 }}>
                <Text style={styles.text}>Press a field to start the game</Text>
                <Button
                    title="New Game"
                    onPress={() => this.setState({
                        fieldType: ['', '', '', '', '', '', '', '', ''],
                        disableFields: false,
                        winnerColumns: []
                    })}
                />
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#3d3d3d', borderRadius: 50 }}>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        margin: 50,
        fontSize: 20,
        textAlign: 'center'
      }
});