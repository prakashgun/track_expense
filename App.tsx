import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from './src/common/dbConnect'
import AccountList from './src/components/AccountList'
import Menu from './src/components/Menu'
import { Account } from './src/entities/Account'

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

  const createDefaultAccounts = async () => {
    await dbConnect()
    const accountRepository = await getRepository(Account)
    const accountsCount = await accountRepository.count()
    console.log('Accounts count')
    console.log(accountsCount)

    if (accountsCount === 0) {
      const account1 = new Account()
      account1.name = 'Cash'
      account1.balance = 0
      await accountRepository.save(account1)
      console.log('Default accounts saved')
    }
  }

  useEffect(() => {
    createDefaultAccounts()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {
          isLoggedIn ?
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="AccountList" component={AccountList} />
              <Stack.Screen name="Menu" component={Menu} />
            </Stack.Navigator>
            : <Text>Please Login</Text>
        }
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default App
