import React, { useEffect } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import stores from './redux/store';
import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from './lib/apiKeys';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigatorWeb from './components/AppNavigatorWeb';

const App: React.FC = () => {
    useEffect(() => {
        if (Platform.OS !== 'web') {
            Sentry.init({
                dsn: SENTRY_DSN,
                enableInExpoDevelopment: false,
                debug: process.env.NODE_ENV === 'development' ? true : false,
            });

            Sentry.setRelease(Constants.manifest.revisionId);
        }
    }, []);

    const { store, persistor } = stores();
    return (
        <Provider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
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
