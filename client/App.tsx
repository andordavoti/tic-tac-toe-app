import React, { useEffect } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { decode, encode } from 'base-64';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import stores from './redux/store';
import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from './lib/apiKeys';
import Constants from 'expo-constants';
import { SplashScreen } from 'expo';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigatorWeb from './components/AppNavigatorWeb';

declare const global: {
    HermesInternal: null | {};
    btoa: typeof encode;
    atob: typeof decode;
};
// Polyfill for Firebase missing base-64 decoder/encoder
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App: React.FC = () => {
    useEffect(() => {
        SplashScreen.preventAutoHide();
    }, []);

    if (Platform.OS !== 'web') {
        Sentry.init({
            dsn: SENTRY_DSN,
            enableInExpoDevelopment: false,
            debug: process.env.NODE_ENV === 'development' ? true : false,
        });

        if (Constants.manifest.revisionId)
            Sentry.setRelease(Constants.manifest.revisionId);
    }

    const { store, persistor } = stores();
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" />
                    {Platform.OS === 'web' ? (
                        <AppNavigatorWeb />
                    ) : (
                        <AppNavigator />
                    )}
                </View>
            </PersistGate>
        </Provider>
    );
};

export default App;
