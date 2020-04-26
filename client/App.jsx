import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { decode, encode } from 'base-64';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';

// Polyfill for Firebase missing base-64 decoder/encoder
if (!global.btoa) global.btoa = encode
if (!global.atob) global.atob = decode

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = { isReady: false }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/images/o.png'),
      require('./assets/images/x.png'),
    ]);

    await Promise.all([...imageAssets]);
  }



  render() {
    if (!this.state.isReady) {
      return <AppLoading
        startAsync={this._loadAssetsAsync}
        onFinish={() => this.setState({ isReady: true })}
        onError={console.warn} />
    }
    return <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </View>
    </Provider>
  }
}
