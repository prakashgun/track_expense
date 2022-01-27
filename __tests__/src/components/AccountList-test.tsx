/**
 * @format
 */

 import 'react-native'
 import React from 'react'
 import {render} from '@testing-library/react-native'
 import AccountList from '../../../src/components/AccountList'
 
 // Note: test renderer must be required after react-native.
 import renderer from 'react-test-renderer'
 
 it('renders correctly', () => {
   renderer.create(<AccountList />)
 })
 
 it('renders default elements', ()=>{
   const {getAllByText} = render(<AccountList />)
   expect(getAllByText('Accounts').length).toBe(1)
 })