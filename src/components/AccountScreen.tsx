import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { deleteAccount, getAccount, getLastAccountTransactions } from '../common/dbQueries'
import { getCurrentBalance, roundCurrency, thousands_separators } from '../common/utils'
import AccountInterface from '../interfaces/AccountInterface'
import TransactionInterface from '../interfaces/TransactionInterface'
import TransactionItem from './TransactionItem'

const AccountScreen = ({ navigation, route }: any) => {
    const [account, setAccount] = useState<AccountInterface>()
    const [currentBalance, setCurrentBalance] = useState<number>(0)
    const [transactions, setTransactions] = useState<TransactionInterface[]>()
    const [isLoading, setIsLoading] = useState(true)
    const isFocused = useIsFocused()

    const setAccountFromDb = async () => {
        setAccount(await getAccount(route.params.id))
        console.log(await getAccount(route.params.id))

    }

    const deleteAccountFromDb = async () => {
        await deleteAccount(route.params.id)
        console.log('Account deleted')
        navigation.navigate('AccountList')
    }

    const setLastTransactions = async () => {
        if (!account) {
            setIsLoading(false)
            return
        }
        setIsLoading(true)
        await setTransactions(await getLastAccountTransactions(account, 10))
        setIsLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            setAccountFromDb()
            setLastTransactions()
        }
    }, [isFocused])

    useEffect(() => {
        if (!account) {
            return
        }
        setCurrentBalance(getCurrentBalance(account))
        setLastTransactions()
    }, [account])

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
            <ScrollView >
                {account && <PricingCard
                    color="#3e3b33"
                    title={account.name}
                    price={thousands_separators(roundCurrency(currentBalance))}
                    button={{ title: 'Delete', onPress: () => onDeleteItemPress() }}
                />}
                {isLoading ? <ActivityIndicator size="large" color="#3e3b33" /> :
                    <View>
                        {
                            transactions && transactions.map((transaction) => (
                                <TransactionItem
                                    transaction={transaction}
                                    key={transaction.id}
                                    onPress={() => 
                                        navigation.navigate(
                                            'EditTransaction', 
                                            { 
                                                id: transaction.id, 
                                                transactionDate: moment.utc(transaction.transaction_date).toDate().toISOString() 
                                            }
                                        )
                                    }
                                />
                            ))
                        }
                    </View>}
            </ScrollView>
        </View>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})
