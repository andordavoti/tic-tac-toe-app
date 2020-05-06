import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/constants';
import { ActivityIndicator } from "react-native-paper";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTheme } from '../redux/settings/settings.selectors';

interface Props {
  theme: 'light' | 'dark'
  msg: string
  size: 'small' | 'large' | number
}

const Spinner: React.FC<Props> = ({ theme, msg, size = 'large' }) => {

  const styles = getStyleSheet(theme)

  return <View>
    <ActivityIndicator
      color={colors[theme].main}
      size={size} />
    <Text style={styles.text}>{msg}</Text>
  </View>
}

const mapStateToProps = createStructuredSelector<any, any>({
  theme: selectTheme,
})

const getStyleSheet = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    text: {
      color: colors[theme].text,
      fontWeight: 'bold',
      fontSize: 15,
      margin: 20,
      textAlign: 'center'
    }
  })
}

export default connect(mapStateToProps)(Spinner)