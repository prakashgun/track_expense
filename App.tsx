import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AccountList from './src/components/AccountList'
import AppNavigator from './src/components/AppNavigator'
import Menu from './src/components/Menu'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}

export default App
