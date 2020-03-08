import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default SelectMode = ({ navigation }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Tic Tac Toe</Text>
        <Button 
          title="Single Player"
          onPress={() => navigation.navigate('Single Player')}
        />
      </View>
    );
  }