import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../lib/Settings';
import Column from './Column';
import { connect } from 'react-redux';
import { selectHaptics, selectTheme } from '../redux/settings/settings.selectors';
import { createStructuredSelector } from 'reselect';

class GameCanvas extends React.Component {
  state = {
    fieldTypes: ['', '', '', '', '', '', '', '', ''],
    turn: 'o',
    disableFields: false,
    winnerColumns: [],
    winner: '',
    gameStart: false,
  };

  componentDidUpdate(prevState) {
    const { fieldTypes, disableFields, gameStart } = this.state;
    const { size } = this.props;

    //check if all fields are pressed
    if (prevState.fieldTypes !== fieldTypes) {
      let counter = 0;
      for (let i = 0; i < fieldTypes.length; i++) if (fieldTypes[i] !== '') counter++;
      if (counter === Math.pow(size, 2) && !disableFields)
        this.setState({ disableFields: true, winner: 'tied' });
      if (counter !== 0 && !gameStart) this.setState({ gameStart: true });
    }
  }

  getStyleSheet = () => {
    const { theme } = this.props

    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      gameOverText: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        margin: 20,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '500',
      },
      winnerText: {
        color: theme === 'dark' ? colors.dark.text : colors.light.text,
        margin: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '400'
      },
      button: {
        margin: 20,
        marginBottom: 40,
        backgroundColor: theme === 'dark' ? colors.dark.main : colors.light.main,
      },
    })
  }

  renderInfo = () => {
    const { disableFields, winner, gameStart } = this.state;
    const { hapticsEnabled, } = this.props;
    const styles = this.getStyleSheet()
    let winnerOutput = '';

    if (winner === 'tied') winnerOutput = <Text style={styles.winnerText}>It's a Tie</Text>;
    else winnerOutput = <Text style={styles.winnerText}>The winner is {winner.toUpperCase()}</Text>;

    if (disableFields && winner !== '') {
      return (
        <View>
          <Text style={styles.gameOverText}>Game Over</Text>
          {winnerOutput}
          <Button
            type="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={() => {
              if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
              this.setState({
                fieldTypes: ['', '', '', '', '', '', '', '', ''],
                disableFields: false,
                winnerColumns: [],
                gameStart: false,
              })
            }}>New Game</Button>
        </View>
      );
    } else if (!gameStart)
      return <Text style={styles.winnerText}>Press a column to start the game</Text>;
  };

  checkLine = (user, combination) => {
    const { fieldTypes } = this.state;
    const { hapticsEnabled } = this.props;

    if (
      fieldTypes[combination[0]] === user &&
      fieldTypes[combination[1]] === user &&
      fieldTypes[combination[2]] === user
    ) {
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success');
      this.setState({
        winner: user,
        disableFields: true,
        winnerColumns: [combination[0], combination[1], combination[2]],
      });
    }
  };

  checkGame = forUser => {
    const winnerCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winnerCombinations.length; i++)
      this.checkLine(forUser, winnerCombinations[i]);
  };

  pressed = num => {
    const { hapticsEnabled } = this.props;

    let fieldTypes = this.state.fieldTypes,
      turn = this.state.turn;

    if (fieldTypes[num] === '') {
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();

      if (turn === 'o') fieldTypes[num] = 'o';
      else fieldTypes[num] = 'x';

      this.checkGame(turn);

      if (turn === 'o') this.setState({ fieldTypes, turn: 'x' });
      if (turn === 'x') this.setState({ fieldTypes, turn: 'o' });
    } else if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error');
  };

  getNum = (y, x) => {
    //TODO: adopt same getNum as in onlineMultiplayer component
    if (x === 1) {
      return x + y - 2;
    }
    if (x === 2) {
      return x + y;
    }
    if (x === 3) {
      return x + y + 2;
    }
  };

  renderGrid = () => {
    const { size } = this.props;
    const sizeArray = [...Array(size + 1).keys()].slice(1);

    return (
      <View>
        {sizeArray.map(x => (
          <View style={{ flexDirection: 'row' }} key={x}>
            {sizeArray.map(y => (
              <Column key={y} action={this.pressed} num={this.getNum(x, y)} {...this.state} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  render() {
    const styles = this.getStyleSheet()

    return (
      <View style={styles.container}>
        <View>{this.renderInfo()}</View>
        {this.renderGrid()}
      </View>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme,
  hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps)(GameCanvas)