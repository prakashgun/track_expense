import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AccountList from './AccountList'
import Menu from './Menu'


const Stack = createNativeStackNavigator()


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AccountList" component={AccountList} />
        
        <Stack.Screen name="Menu" component={Menu} />
      </Stack.Navigator>
  )
}

export default AppNavigator