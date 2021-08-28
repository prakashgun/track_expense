import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { getTransaction } from '../common/dbQueries'
import { Transaction } from '../entities/Transaction'

const TransactionScreen = ({ navigation, route }) => {
    const [transaction, setTransaction] = useState<Transaction>()
    const isFocused = useIsFocused()

    const deleteTransaction = async () => {
        await dbConnect()
        const transactionRepository = getRepository(Transaction)
        await transactionRepository.delete(route.params.id)
        console.log('Transaction deleted')
        navigation.navigate('TransactionList')
    }

    const setTransactionFromDb = async () => {
        setTransaction(await getTransaction(route.params.id))
    }

    useEffect(() => {
        if (isFocused) {
            setTransactionFromDb()
        }
    }, [isFocused])

    const onDeleteItemPress = () => {
        Alert.alert(
            'Delete',
            'Delete this transaction and all associated records ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteTransaction()
                }
            ]
        )
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Transaction Detail' }}
            />
            {transaction && <PricingCard
                color="#3e3b33"
                title={transaction.name}
                price={transaction.balance}
                button={{ title: 'Delete', onPress: () => onDeleteItemPress() }}
            />}
        </View>
    )
}

export default TransactionScreen

const styles = StyleSheet.create({})
