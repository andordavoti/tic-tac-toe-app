import React from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colorsWithTheme } from '../lib/Settings';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

class Column extends React.Component {
  state = { isWinnerColumn: false };

  componentDidUpdate(prevProps) {
    if (prevProps.winnerColumns !== this.props.winnerColumns) this.checkIfWinnerColumn()
  }

  checkIfWinnerColumn = () => {
    const { winnerColumns, num } = this.props
    const { isWinnerColumn } = this.state;

    if ((winnerColumns[0] === num || winnerColumns[1] === num || winnerColumns[2] === num) && !isWinnerColumn) {
      this.setState({ isWinnerColumn: true })
    }
    else if (winnerColumns) this.setState({ isWinnerColumn: false });
  }

  getStyles = () => {
    const { disableFields, theme } = this.props;
    return {
      column: {
        maxWidth: Dimensions.get('window').height * 0.1,
        maxHeight: Dimensions.get('window').height * 0.1,
        width: Dimensions.get('window').width * 0.22,
        height: Dimensions.get('window').width * 0.22,
        backgroundColor: disableFields ? 'grey' : (theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.light.main),
        borderRadius: 10,
        margin: 10,
      },
    };
  };

  render() {
    let icon;
    const { fieldType, num, action, disableFields, theme } = this.props;
    const { isWinnerColumn } = this.state;
    const styles = this.getStyles();
    const currentFieldType = fieldType[num];

    if (currentFieldType === 'o') icon = 'circle-outline'
    else if (currentFieldType === 'x') icon = 'close'

    return (
      <TouchableOpacity
        disabled={disableFields || Boolean(currentFieldType)}
        style={styles.column}
        onPress={() => {
          if (!currentFieldType) action(num);
        }}>
        {currentFieldType !== '' ?
          <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
            <MaterialCommunityIcons
              style={{ textAlign: 'center', marginTop: 5 }}
              color={!isWinnerColumn ? 'white' : (theme === 'dark' ? colorsWithTheme.dark.main : colorsWithTheme.dark.main)}
              name={icon}
              size={70} />
          </View>
          : null}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  theme: selectTheme
})

export default connect(mapStateToProps)(Column)
