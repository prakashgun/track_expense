import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getTransactions } from '../common/dbQueries'
import { thousands_separators } from '../common/utils'
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
                <ListItem.Title style={{ color: (transaction.is_income) ? 'green' : 'red' }}>
                    {thousands_separators(transaction.value)}
                </ListItem.Title>
                <ListItem.Subtitle>{transaction.account.name}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity>
)

const TransactionList = () => {
    const navigation = useNavigation<any>()
    const [transactions, setTransactions] = useState<TransactionInterface[]>()
    const [transactionDate, setTransactionDate] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true)
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            setTransactionsFromDb(transactionDate)
        }
    }, [isFocused])

    const setTransactionsFromDb = async (date: Date) => {
        setIsLoading(true)
        setTransactionDate(date)
        await setTransactions(await getTransactions(date))
        setIsLoading(false)
    }

    const decreaseDay = () => {
        let newDate = transactionDate
        newDate.setDate(transactionDate.getDate() - 1)
        setTransactionDate(newDate)
        setTransactionsFromDb(newDate)
    }


    const currentDay = () => {
        let newDate = new Date()
        setTransactionDate(newDate)
        setTransactionsFromDb(newDate)
    }

    const increaseDay = () => {
        let newDate = transactionDate
        newDate.setDate(transactionDate.getDate() + 1)
        setTransactionDate(newDate)
        setTransactionsFromDb(newDate)
    }

    return (
        <View style={styles.container}>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Transactions' }}
                />
                <View style={styles.date_menu_panel}>
                    <DatePicker mode="date" androidVariant="nativeAndroid" date={transactionDate} onDateChange={setTransactionsFromDb} />
                    <View style={styles.date_quick_nav}>
                        <Icon name="caretup" type="ant-design" onPress={decreaseDay} />
                        <Icon name="today" type="ion-icons" onPress={currentDay} />
                        <Icon name="caretdown" type="ant-design" onPress={increaseDay} />
                    </View>
                </View>
                {isLoading ? <ActivityIndicator size="large" color="#3e3b33" /> :
                    <View>
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
                    </View>}
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
    date_menu_panel: {
        flexDirection: 'row'
    },
    date_quick_nav: {
        justifyContent: 'space-around',
    }
})
