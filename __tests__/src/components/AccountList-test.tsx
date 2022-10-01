/**
 * @format
 */

import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import 'react-native'
import AccountList from '../../../src/components/AccountList'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'
import AppNavigator from '../../../src/components/AppNavigator'

jest.useFakeTimers()

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

it('renders correctly', async () => {
  renderer.create(<AccountList />)
})

it('renders default elements', async () => {
  const { getAllByText } = render(<AccountList />)
  expect(getAllByText('Accounts').length).toBe(1)
})

it('go to add account page', async () => {
  const { getAllByText } = render(
    <AppNavigator />
  )

  const toClick = await screen.findByText('Add')
  fireEvent(toClick, 'press')

  expect(getAllByText('Add Account')).toBeTruthy()
})