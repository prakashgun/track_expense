import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

const Stack = createNativeStackNavigator();

const App = () => {
  return ( 
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App
