import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import createDefaultAccounts from './src/common/createDefaultAccounts'
import createDefaultCategories from './src/common/createDefaultCategories'
import AccountList from './src/components/AccountList'
import AccountScreen from './src/components/AccountScreen'
import AddAccount from './src/components/AddAccount'
import AddCategory from './src/components/AddCategory'
import CategoryList from './src/components/CategoryList'
import CategoryScreen from './src/components/CategoryScreen'
import Menu from './src/components/Menu'

const theme = {
  Button: {
    buttonStyle: {
      backgroundColor: '#3e3b33'
    },
  },
  Header: {
    placement: 'left',
    leftComponent: { icon: 'menu', color: '#fff' },
    centerComponent: { text: 'MY TITLE', style: { color: '#fff', fontSize: 18 } },
    rightComponent: { icon: 'home', color: '#fff' },
    backgroundColor: '#3e3b33'
  }
}

const Stack = createNativeStackNavigator()

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)

  useEffect(() => {
    createDefaultAccounts()
    createDefaultCategories()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {
          isLoggedIn ?
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="AccountList" component={AccountList} />
              <Stack.Screen name="AddAccount" component={AddAccount} />
              <Stack.Screen name="AccountScreen" component={AccountScreen} />
              <Stack.Screen name="CategoryList" component={CategoryList} />
              <Stack.Screen name="AddCategory" component={AddCategory} />
              <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
              <Stack.Screen name="Menu" component={Menu} />
            </Stack.Navigator>
            : <Text>Please Login</Text>
        }
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default App
