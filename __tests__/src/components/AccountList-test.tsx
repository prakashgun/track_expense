/**
 * @format
 */

 import 'react-native'
 import React from 'react'
 import { fireEvent, render, screen } from '@testing-library/react-native';
 import AccountList from '../../../src/components/AccountList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addAccount, deleteAccount, getAccount, getAccounts } from '../../../src/common/dbQueries'
import { NavigationContainer } from '@react-navigation/native'

// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

 
 // Note: test renderer must be required after react-native.
 import renderer from 'react-test-renderer'
import AppNavigator from '../../../src/components/AppNavigator';
 
jest.useFakeTimers()

const accounts = [
  {
      id: '1',
      name: 'account1',
      initial_balance: 0
  }
]

beforeEach(async () => {
  await AsyncStorage.clear()

})
 
it('renders correctly', async () => {
   renderer.create(<AccountList />)
})
 
it('renders default elements', async ()=>{
   const {getAllByText} = render(<AccountList />)
   expect(getAllByText('Accounts').length).toBe(1)
   expect(getAllByText('Add').length).toBe(1)
})

// it('add account navigation', async ()=>{
//   const {getAllByText} = render(<AccountList />)
//   expect(getAllByText('Accounts').length).toBe(1)
//   expect(getAllByText('Add').length).toBe(1)
//   const addButtonNode = screen.getByText('Add')
//   fireEvent.press(screen.getByText('Add'))
// })

// describe('Testing react navigation', () => {
//   test('page contains the header and 10 items', async () => {
//     const component = (
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     );

//     render(component)

//     const toClick = await screen.findByText('Add')
//     fireEvent(toClick, 'press')
//     const newHeader = await screen.findByText('account1');
//     const newBody = await screen.findByText('the number you have chosen is 5');

//     expect(newHeader).toBeTruthy();
//     expect(newBody).toBeTruthy();
//   })
// })
