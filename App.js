import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StatusBar } from 'react-native';

import AppNavigator from './components/AppNavigator';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <AppNavigator />
    </View>
  );
}

export default App;