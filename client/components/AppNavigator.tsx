import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
import analytics from '@react-native-firebase/analytics';

const Tab = createBottomTabNavigator();

const GameStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const GameStackScreen: React.FC = () => {
    const theme = useSelectedTheme();
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
                    headerTitleAlign: 'center',
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
                    headerTitleAlign: 'center',
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
                    headerTitleAlign: 'center',
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
    const theme = useSelectedTheme();
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
                    headerTitleAlign: 'center',
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

    const routeNameRef = useRef<string | undefined>();
    const navigationRef = useRef<any>();

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current =
                    navigationRef?.current?.getCurrentRoute()?.name;
            }}
            onStateChange={async () => {
                const previousRouteName = routeNameRef?.current;
                const currentRouteName =
                    navigationRef?.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
            }}
        >
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors[theme].main,
                        shadowColor: 'transparent',
                        borderTopWidth: 0,
                    },
                    tabBarIcon: ({ focused, size }) => {
                        const color = focused ? 'white' : 'lightgrey';
                        const iconName =
                            route.name === 'SettingsTab' ? 'cog' : 'gamepad';
                        return (
                            <MaterialCommunityIcons
                                color={color}
                                name={iconName}
                                size={size}
                            />
                        );
                    },
                })}
            >
                <Tab.Screen name="HomeTab" component={GameStackScreen} />
                <Tab.Screen
                    name="SettingsTab"
                    component={SettingsStackScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
