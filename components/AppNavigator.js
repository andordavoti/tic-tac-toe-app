import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SelectMode from '../screens/SelectMode';
import SinglePlayer from '../screens/SinglePlayer';

const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Single Player"
                    component={SinglePlayer}
                    options={{
                        headerTitleStyle: {
                            textAlign: 'center'
                        },
                        headerStyle: {
                            backgroundColor: '#270091',
                        },
                        headerTintColor: '#fff'
                    }} />
                <Stack.Screen
                    name="Select Mode"
                    component={SelectMode} options={{
                        headerTitleStyle: {
                            textAlign: 'center',
                        },
                        headerStyle: {
                            backgroundColor: '#270091',
                        },
                        headerTintColor: '#fff'
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;