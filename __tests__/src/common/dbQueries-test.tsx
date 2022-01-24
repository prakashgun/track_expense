import AsyncStorage from '@react-native-async-storage/async-storage'
import { addAccount, deleteAccount, getAccount, getAccounts } from '../../../src/common/dbQueries'

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

    test('adding account works', async () => {
        const account = accounts[0]
        const result = await addAccount(account)
        expect(result).toEqual(true)
        expect(await getAccounts()).toEqual(accounts)
        expect(await getAccount(account.id)).toEqual(account)
    })

    test('deleting account works', async ()=>{
        const account = accounts[0]
        const result = await addAccount(account)
        expect(result).toEqual(true)
        const result2 = await deleteAccount(account.id)
        expect(result2).toEqual(true)
        expect(await getAccounts()).toEqual([])
    })
})
