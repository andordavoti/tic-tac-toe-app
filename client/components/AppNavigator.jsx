import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../lib/Settings';
import SelectMode from '../screens/SelectMode';
import Multiplayer from '../screens/Multiplayer';
import OnlineMultiplayer from '../screens/OnlineMultiplayer/OnlineMultiplayer';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator()

const GameStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const GameStackScreen = () => {
  return <GameStack.Navigator>
    <GameStack.Screen
      name="Select Mode"
      component={SelectMode}
      options={{
        title: 'Tic Tac Toe',
        headerStyle: {
          backgroundColor: colors.main,
          shadowColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20
        },
        headerTintColor: '#fff',
      }}
    />
    <GameStack.Screen
      name="Multiplayer"
      component={Multiplayer}
      options={{
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: colors.main,
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
          backgroundColor: colors.main,
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
}

const SettingsStackScreen = () => {
  return <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerStyle: {
          backgroundColor: colors.main,
          shadowColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#fff',
      }}
    />
    <SettingsStack.Screen
      name="About"
      component={AboutScreen}
      options={{
        title: 'About',
        headerStyle: {
          backgroundColor: colors.main,
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
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName
          let color = (focused ? 'white' : 'grey')
          if (route.name === 'Settings') iconName = 'settings'
          else iconName = 'gamepad'
          return <MaterialCommunityIcons color={color} name={iconName} size={size} />
        }
      })}
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          style: {
            backgroundColor: colors.main,
            shadowColor: 'transparent',
            borderTopWidth: 0,
          },
        }} >
        <Tab.Screen name='Home' component={GameStackScreen} />
        <Tab.Screen name='Settings' component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
