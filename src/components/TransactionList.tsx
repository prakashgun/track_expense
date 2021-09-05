import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getTransactions } from '../common/dbQueries'
import TransactionInterface from '../interfaces/TransactionInterface'
import TransactionItemInterface from '../interfaces/TransactionItemInterface'

const TransactionItem = ({ transaction, onPress }: TransactionItemInterface) => (
    <TouchableOpacity onPress={onPress}>
        <ListItem
            key={transaction.id}
            bottomDivider
        >
            {
                (transaction.id === transaction.from_transaction?.id
                    || transaction.id === transaction.to_transaction?.id) &&
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
        setTransactionDate(date)
        await setTransactions(await getTransactions(date))
    }

    useEffect(() => {
        if (isFocused) {
            setTransactionsFromDb(transactionDate)
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Transactions' }}
                />
                <DatePicker mode="date" androidVariant="nativeAndroid" date={transactionDate} onDateChange={setTransactionsFromDb} />
                {
                    transactions && transactions.map((transaction) => (
                        <TransactionItem
                            transaction={transaction}
                            key={transaction.id}
                            onPress={() => {
                                return navigation.navigate('EditTransaction', { id: transaction.id, transactionDate: transactionDate.toISOString() })
                            }}
                        />
                    ))
                }
            </ScrollView>
            <Button title="Add" onPress={() => navigation.navigate('AddTransaction', { transactionDate: transactionDate.toISOString() })} />
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
