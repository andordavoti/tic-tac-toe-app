import React from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import AppNavigator from './components/AppNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigatorWeb from './components/AppNavigatorWeb';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { toastConfig } from './lib/toast';
import store, { persistor } from './redux/store';

if (Platform.OS !== 'web') {
    LogBox.ignoreLogs([
        'YellowBox has been replaced with LogBox. Please call LogBox.ignoreLogs() instead.',
        'Cannot update a component from inside the function body of a different component.',
    ]);
}

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" />
                    {Platform.OS === 'web' ? (
                        <AppNavigatorWeb />
                    ) : (
                        <AppNavigator />
                    )}
                    <Toast config={toastConfig} />
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
};

export default App;
