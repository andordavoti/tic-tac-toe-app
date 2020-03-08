import React from 'react';
import { Dimensions, TouchableOpacity, Image } from 'react-native';

export default class Column extends React.Component {
    state = { isWinnerColumn: false };

    componentDidUpdate(prevProps) {
        if (prevProps.winnerColumns !== this.props.winnerColumns) {
            this.checkIfWinnerColumn()
        }
    }

    checkIfWinnerColumn = () => {
        let { winnerColumns, num } = this.props;
        let { isWinnerColumn } = this.state;

        if ((winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num ) && !isWinnerColumn) {
            this.setState({ isWinnerColumn: true })
        }
        else {
            this.setState({ isWinnerColumn: false })
        }
    }

    getStyles = (isWinnerColumn) => {
        return {
            column: {
                width: Dimensions.get('window').width * 0.22,
                height: Dimensions.get('window').width * 0.22,
                backgroundColor: '#270091',
                borderRadius: 10,
                borderWidth: 5,
                borderColor: isWinnerColumn ? 'green' : 'white',
                margin: 10
            },
            image: {
                flex: 1,
                height: '100%',
                width: '100%',
            }
        }
    }

    render() {
        let path;

        let { fieldType, num, action, disabled } = this.props;
        let { isWinnerColumn } = this.state;

        let styles = this.getStyles(isWinnerColumn);

        if (fieldType === 'o') { path = require(`../assets/images/o.png`) }
        if (fieldType === 'x') { path = require(`../assets/images/x.png`) }

        return (
            <TouchableOpacity disabled={disabled} style={styles.column} onPress={() => action(num)}>
                {fieldType !== '' ? <Image style={styles.image} source={path} /> : null}
            </TouchableOpacity>
        );
    }
}

