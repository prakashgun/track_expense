import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import 'react-native-get-random-values'
import { createTables, generateDefaultData } from './src/common/dbQueries'
import AccountList from './src/components/AccountList'
import AccountScreen from './src/components/AccountScreen'
import AddAccount from './src/components/AddAccount'
import AddCategory from './src/components/AddCategory'
import AddTransaction from './src/components/AddTransaction'
import CategoryList from './src/components/CategoryList'
import CategoryScreen from './src/components/CategoryScreen'
import EditTransaction from './src/components/EditTransaction'
import ImportTransactions from './src/components/ImportTransactions'
import Menu from './src/components/Menu'
import TransactionList from './src/components/TransactionList'
import TransactionScreen from './src/components/TransactionScreen'


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
    // rightComponent: { icon: 'home', color: '#fff' },
    backgroundColor: '#3e3b33'
  }
}

const Stack = createNativeStackNavigator()

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)

  const initialSetup = async () => {
    await createTables()
    await generateDefaultData()
  }

  useEffect(() => {
    initialSetup()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {
          isLoggedIn ?
            <Stack.Navigator screenOptions={{ headerShown: false }}>

              <Stack.Screen name="TransactionList" component={TransactionList} />
              <Stack.Screen name="AddTransaction" component={AddTransaction} />
              <Stack.Screen name="EditTransaction" component={EditTransaction} />
              <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
              <Stack.Screen name="ImportTransactions" component={ImportTransactions} />

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
