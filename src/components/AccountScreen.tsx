import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { deleteAccount, getAccount } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'

const AccountScreen = ({ navigation, route }: any) => {
    const [account, setAccount] = useState<AccountInterface>()
    const isFocused = useIsFocused()

    const setAccountFromDb = async () => {
        setAccount(await getAccount(route.params.id))
    }

    const deleteAccountFromDb = async () => {
        await deleteAccount(route.params.id)
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
                    onPress: () => deleteAccountFromDb()
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
                price={account.initial_balance}
                button={{ title: 'Delete', onPress: () => onDeleteItemPress() }}
            />}
        </View>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})
