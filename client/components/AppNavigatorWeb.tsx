import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { colors } from '../lib/constants';
import SelectMode from '../screens/SelectMode';
import Multiplayer from '../screens/Multiplayer';
import OnlineMultiplayer from '../screens/OnlineMultiplayer';
import SettingsScreen from '../screens/SettingsScreen';

import { useDispatch } from 'react-redux';
import {
    setCurrentTheme,
    useSelectedTheme,
    useSystemThemeEnabled,
} from '../redux/settingsSlice';
import { useColorScheme } from 'react-native';

const AppNavigatorWeb: React.FC = () => {
    const theme = useSelectedTheme();
    const systemThemeEnabled = useSystemThemeEnabled();

    const dispatch = useDispatch();

    const deviceTheme = useColorScheme();

    if (
        (deviceTheme === 'light' || deviceTheme === 'dark') &&
        systemThemeEnabled
    ) {
        dispatch(setCurrentTheme(deviceTheme));
    }

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Select Mode"
                    component={SelectMode}
                    options={{
                        title: 'Tic Tac Toe',
                        headerStyle: {
                            backgroundColor: colors[theme].main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerTintColor: 'white',
                    }}
                />
                <Stack.Screen
                    name="Multiplayer"
                    component={Multiplayer}
                    options={{
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: colors[theme].main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                    }}
                />
                <Stack.Screen
                    name="Online Multiplayer"
                    component={OnlineMultiplayer}
                    options={{
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: colors[theme].main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        title: 'Settings',
                        headerStyle: {
                            backgroundColor: colors[theme].main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigatorWeb;
