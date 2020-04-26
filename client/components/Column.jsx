import React from 'react';
import { Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import { colors, colorsWithTheme } from '../lib/Settings';

class Column extends React.Component {
  state = { isWinnerColumn: false };

  componentDidUpdate(prevProps) {
    if (prevProps.winnerColumns !== this.props.winnerColumns) this.checkIfWinnerColumn();
  }

  checkIfWinnerColumn = () => {
    const { winnerColumns, num } = this.props,
      { isWinnerColumn } = this.state;

    if (
      (winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num) &&
      !isWinnerColumn
    )
      this.setState({ isWinnerColumn: true });
    else if (winnerColumns) this.setState({ isWinnerColumn: false });
  };

  getWinnerColumnColor = () => {
    const { isWinnerColumn } = this.state;
    const { theme } = this.props

    if (isWinnerColumn) {
      if (theme === 'dark') return colorsWithTheme.dark.main
      else return colorsWithTheme.light.main
    } else {
      if (theme === 'dark') return colorsWithTheme.dark.text
      else return colorsWithTheme.light.text
    }
  }

  getStyles = () => {
    const { disableFields } = this.props;
    const { isWinnerColumn } = this.state;
    return {
      column: {
        maxWidth: Dimensions.get('window').height * 0.1,
        maxHeight: Dimensions.get('window').height * 0.1,
        width: Dimensions.get('window').width * 0.22,
        height: Dimensions.get('window').width * 0.22,
        backgroundColor: disableFields ? 'grey' : colors.main,
        borderRadius: 10,
        borderWidth: isWinnerColumn ? 8 : 2,
        borderColor: this.getWinnerColumnColor(),
        margin: 10,
      },
      image: {
        flex: 1,
        height: '100%',
        width: '100%',
      },
    };
  };
  render() {
    let path;
    const { fieldType, num, action, disableFields } = this.props;
    const styles = this.getStyles();
    const currentFieldType = fieldType[num];

    if (currentFieldType === 'o') path = require(`../assets/images/o.png`);
    if (currentFieldType === 'x') path = require(`../assets/images/x.png`);

    return (
      <TouchableOpacity
        disabled={disableFields || Boolean(currentFieldType)}
        style={styles.column}
        onPress={() => {
          if (!currentFieldType) action(num);
        }}
      >
        {currentFieldType !== '' ? <Image style={styles.image} source={path} /> : null}
      </TouchableOpacity>
    );
  }
}

export default Column;
