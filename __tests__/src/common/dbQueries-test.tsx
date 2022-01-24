import AsyncStorage from '@react-native-async-storage/async-storage'
import { addAccount, getAccounts } from '../../../src/common/dbQueries'

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

describe('Accounts', () => {
    test('if no accounts exists return an empty array', async () => {
        expect(await getAccounts()).toEqual([])
    })

    test('adding works', async () => {
        const result = await addAccount(accounts[0])
        expect(result).toEqual(true)
        expect(await getAccounts()).toEqual(accounts)
    })
})
