import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AppNavigator from './src/components/AppNavigator'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <AppNavigator />
  )
}

export default App
