import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { getAccount } from '../common/dbQueries'
import { Account } from '../entities/Account'

const AccountScreen = ({ navigation, route }) => {
    const [account, setAccount] = useState<Account>()
    const isFocused = useIsFocused()

    const setAccountFromDb = async () => {
        setAccount(await getAccount(route.params.id))
    }

    const deleteAccount = async () => {
        await dbConnect()
        const accountRepository = getRepository(Account)
        await accountRepository.delete(route.params.id)
        console.log('Account deleted')
        navigation.navigate('AccountList')
    }

    useEffect(() => {
        if (isFocused) {
            setAccountFromDb()
        }
    }, [isFocused])

    const onDeleteItemPress = () => {
        Alert.alert(
            'Delete',
            'Delete this account and all associated records ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteAccount()
                }
            ]
        )
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Account Detail' }}
            />
            {account && <PricingCard
                color="#3e3b33"
                title={account.name}
                price={account.balance}
                button={{ title: 'Delete', onPress: () => onDeleteItemPress() }}
            />}
        </View>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})
