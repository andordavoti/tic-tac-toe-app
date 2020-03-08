import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import GameCanvas from '../components/GameCanvas';

export default SinglePlayer = () => {

  return (
    <View style={styles.container}>
      <GameCanvas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3d3d3d'
  }
});