import AsyncStorage from "@react-native-async-storage/async-storage"
import AccountInterface from "../interfaces/AccountInterface"

export const addAccount = async (account: AccountInterface): Promise<boolean> => {
    if (account) {
        try {
            const jsonValue = await AsyncStorage.getItem('@accounts')
            const result = jsonValue != null ? JSON.parse(jsonValue) : []
            result.push(account)
            await AsyncStorage.setItem('@accounts', JSON.stringify(result))
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return false
}

export const getAccounts = async (): Promise<AccountInterface[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@accounts')
        return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getAccount = async (id: string): Promise<AccountInterface | {}> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@accounts')
        const accounts = jsonValue != null ? JSON.parse(jsonValue) : []
        return accounts.find((data: AccountInterface) => data.id === id)
    } catch (error) {
        console.log(error)
        return {}
    }
}

export const deleteAccount = async (id: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@accounts')
        const accounts = jsonValue != null ? JSON.parse(jsonValue) : []
        const result = accounts.find((data: AccountInterface) => data.id !== id)
        await AsyncStorage.setItem('@accounts', JSON.stringify(result))
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}