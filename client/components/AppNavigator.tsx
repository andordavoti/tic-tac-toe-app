import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

import { colors } from '../lib/constants';
import SelectMode from '../screens/SelectMode';
import Multiplayer from '../screens/Multiplayer';
import OnlineMultiplayer from '../screens/OnlineMultiplayer';
import SettingsScreen from '../screens/SettingsScreen';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTheme } from '../redux/settings/settings.action';
import {
    selectSystemTheme,
    selectTheme,
} from '../redux/settings/settings.selectors';

const Tab = createBottomTabNavigator();

const GameStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const GameStackScreen: React.FC = () => {
    const theme = useSelector(selectTheme);
    return (
        <GameStack.Navigator>
            <GameStack.Screen
                name="Select Mode"
                component={SelectMode}
                options={{
                    title: 'Tic Tac Toe',
                    headerStyle: {
                        backgroundColor: colors[theme].main,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                    headerTintColor: 'white',
                }}
            />
            <GameStack.Screen
                name="Multiplayer"
                component={Multiplayer}
                options={{
                    headerBackTitle: 'Back',
                    headerStyle: {
                        backgroundColor: colors[theme].main,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <GameStack.Screen
                name="Online Multiplayer"
                component={OnlineMultiplayer}
                options={{
                    headerBackTitle: 'Back',
                    headerStyle: {
                        backgroundColor: colors[theme].main,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTintColor: '#fff',
                }}
            />
        </GameStack.Navigator>
    );
};

const SettingsStackScreen: React.FC = () => {
    const theme = useSelector(selectTheme);
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: colors[theme].main,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTintColor: '#fff',
                }}
            />
        </SettingsStack.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const theme = useSelector(selectTheme);
    const systemThemeEnabled = useSelector(selectSystemTheme);

    const dispatch = useDispatch();

    const deviceTheme = useColorScheme();

    if (
        (deviceTheme === 'light' || deviceTheme === 'dark') &&
        systemThemeEnabled
    ) {
        dispatch(setCurrentTheme(deviceTheme));
    }

    return (
        <AppearanceProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, size }) => {
                            let iconName;
                            let color = focused ? 'white' : 'lightgrey';
                            if (route.name === 'Settings')
                                iconName = 'settings';
                            else iconName = 'gamepad';
                            return (
                                <MaterialCommunityIcons
                                    color={color}
                                    name={iconName}
                                    size={size}
                                />
                            );
                        },
                    })}
                    tabBarOptions={{
                        showLabel: false,
                        showIcon: true,
                        style: {
                            backgroundColor: colors[theme].main,
                            shadowColor: 'transparent',
                            borderTopWidth: 0,
                        },
                    }}
                >
                    <Tab.Screen name="Home" component={GameStackScreen} />
                    <Tab.Screen
                        name="Settings"
                        component={SettingsStackScreen}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    );
};

export default AppNavigator;
