import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getTransactions } from '../common/dbQueries'
import { Transaction } from '../entities/Transaction'

interface TransactionItemInterface {
    transaction: Transaction,
    onPress: () => void
}

const TransactionItem = ({ transaction, onPress }: TransactionItemInterface) => (
    <TouchableOpacity onPress={onPress}>
        <ListItem
            key={transaction.id}
            bottomDivider
        >
            <Icon name="bank" type="font-awesome" />
            <ListItem.Content>
                <ListItem.Title>{transaction.name}</ListItem.Title>
                <ListItem.Subtitle>{transaction.account.name}</ListItem.Subtitle>
                <ListItem.Subtitle>{transaction.category.name}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title>{transaction.value}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity>
)

const TransactionList = () => {

    const navigation = useNavigation<any>()
    const [transactions, setTransactions] = useState<Transaction[]>()
    const isFocused = useIsFocused()

    const setTransactionsFromDb = async () => {
        setTransactions(await getTransactions())
    }

    useEffect(() => {
        if (isFocused) {
            setTransactionsFromDb()
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Transactions' }}
                />
                {
                    transactions && transactions.map((transaction) => (
                        <TransactionItem
                            transaction={transaction}
                            key={transaction.id}
                            onPress={() => {
                                return navigation.navigate('TransactionScreen', { id: transaction.id })
                            }}
                        />
                    ))
                }
            </ScrollView>
            <Button title="Add" onPress={() => navigation.navigate('AddTransaction')} />
        </View>
    )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
