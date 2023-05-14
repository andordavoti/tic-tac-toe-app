import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigatorWeb from './components/AppNavigatorWeb';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { toastConfig } from './lib/toast';
import store, { persistor } from './redux/store';
import { IS_WEB } from './lib/constants';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

Sentry.init({
    release: Constants.manifest.version,
    dsn: 'https://bfbcd5574b7849d099745490b29093c6@o384994.ingest.sentry.io/4505183470813184',
    enableInExpoDevelopment: true,
    debug: __DEV__,
});

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" />
                    {IS_WEB ? <AppNavigatorWeb /> : <AppNavigator />}
                    <Toast config={toastConfig} />
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
};

export default App;
