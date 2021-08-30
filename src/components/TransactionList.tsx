import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, FAB, Header, Icon, ListItem, Text } from 'react-native-elements'
import { getTransactions } from '../common/dbQueries'
import TransactionInterface from '../interfaces/TransactionInterface'
import TransactionItemInterface from '../interfaces/TransactionItemInterface'

const DateScroller = ({ currentDate, decreaseDay, increaseDay }: any) => {
    return (
        <View style={styles.date_scroller}>
            <FAB title="-" color="#3e3b33" onPress={decreaseDay} />
            <Text style={styles.date_scroller_text}>{currentDate.toDateString()}</Text>
            <FAB title="+" color="#3e3b33" onPress={increaseDay} />
        </View>
    )
}

const TransactionItem = ({ transaction, onPress }: TransactionItemInterface) => (
    <TouchableOpacity onPress={onPress}>
        <ListItem
            key={transaction.id}
            bottomDivider
        >
            {
                (transaction.id === transaction.from_id
                    || transaction.id === transaction.to_id) &&
                <Icon name="bank-transfer" type="material-community" />
            }
            <Icon
                name={(transaction.is_income) ? 'attach-money' : 'money-off'}
                type="material-icons"
            />
            <ListItem.Content>
                <ListItem.Title>{transaction.category.name}</ListItem.Title>
                {transaction.name.trim() !== '' && <ListItem.Subtitle>{transaction.name}</ListItem.Subtitle>}
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title>{transaction.value}</ListItem.Title>
                <ListItem.Subtitle>{transaction.account.name}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity>
)

const TransactionList = () => {
    const navigation = useNavigation<any>()
    const [transactions, setTransactions] = useState<TransactionInterface[]>()
    const [transactionDate, setTransactionDate] = useState<Date>(new Date())
    const [count, setCount] = useState(0)
    const isFocused = useIsFocused()

    const setTransactionsFromDb = async (date: Date) => {
        await setTransactions(await getTransactions(date))
    }

    useEffect(() => {
        if (isFocused) {
            setTransactionsFromDb(transactionDate)
        }
    }, [isFocused])

    const decreaseDay = () => {
        console.log('Decresing day')
        transactionDate.setDate(transactionDate.getUTCDate() - 1)
        setTransactionDate(transactionDate)
        setCount(count + 1)
        setTransactionsFromDb(transactionDate)
    }

    const increaseDay = () => {
        console.log('Increasing day')
        transactionDate.setDate(transactionDate.getUTCDate() + 1)
        setTransactionDate(transactionDate)
        setCount(count + 1)
        setTransactionsFromDb(transactionDate)
    }

    return (
        <View style={styles.container}>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Transactions' }}
                />
                <DateScroller
                    currentDate={transactionDate}
                    decreaseDay={decreaseDay}
                    increaseDay={increaseDay}
                    count={count}
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
            <Button title="Add" onPress={() => navigation.navigate('AddTransaction', {transactionDate: transactionDate.toISOString()})} />
        </View>
    )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    date_scroller: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10
    },
    date_scroller_text: {
        fontSize: 16
    }
})
