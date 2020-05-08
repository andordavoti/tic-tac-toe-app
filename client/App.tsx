import React from 'react';
import { View, StatusBar } from 'react-native';
import { decode, encode } from 'base-64';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import store from './redux/store';

declare const global: { HermesInternal: null | {}; btoa: typeof encode; atob: typeof decode };
// Polyfill for Firebase missing base-64 decoder/encoder
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </View>
    </Provider>
  );
};

export default App;
