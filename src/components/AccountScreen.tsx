import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { Account } from '../entities/Account'

interface AccountScreenInterface {
    id: string
}

const AccountScreen = ({ id }: AccountScreenInterface) => {
    const navigation = useNavigation<any>()
    const [account, setAccount] = useState<Account>()

    const getAccount = async () => {
        await dbConnect()
        const accountRepository = getRepository(Account)
        setAccount(await accountRepository.findOne(id))
    }

    useEffect(() => {
        getAccount()
    }, [])

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Accounts' }}
            />
            <Text>Account</Text>
            {account && <Text>{account.name}</Text>}
        </View>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})
