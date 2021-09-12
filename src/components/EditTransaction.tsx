import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { Button, Header, Input } from 'react-native-elements'
import { addTransaction, addTransfer, deleteTransaction, getAccounts, getCategories, getTransaction, getTransfer } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import TransactionInterface from '../interfaces/TransactionInterface'
import TransactionTypeInterface, { transactionTypes } from '../interfaces/TransactionTypeInterface'
import TransferInterface from '../interfaces/TransferInterface'
import AccountSelect from './AccountSelect'
import CategorySelect from './CategorySelect'
import TransactionTypeSelect from './TransactionTypeSelect'


const EditTransaction = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date(route.params.transactionDate)
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionTypeInterface>()
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
    const [transaction, setTransaction] = useState<TransactionInterface>()
    const [transfer, setTransfer] = useState<TransferInterface>()
    const [isLoading, setIsLoading] = useState(true)
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
    }

    const setCategoriesFromDb = async () => {
        const allCategories = await getCategories()
        setCategories(allCategories)
        setSelectedCategory(allCategories[0])
    }

    const setTransactionFromDb = async () => {
        setIsLoading(true)
        setTransaction(await getTransaction(route.params.id))
        setIsLoading(false)
    }

    const setTransferFromDb = async () => {
        if (!transaction) {
            console.log('Transaction not exist')
            return
        }
        setTransfer(await getTransfer(transaction))
    }

    useEffect(() => {
        if (isFocused) {
            setAccountsFromDb()
            setCategoriesFromDb()
            setTransactionFromDb()
        }
    }, [isFocused])

    useEffect(() => {
        if (!transaction) {
            console.log('Transaction not exist')
            return
        }
        setSelectedAccount(transaction.account)
        setSelectedCategory(transaction.category)
        setName(transaction.name)
        setValue(transaction.value.toString())
        setTransferFromDb()

        if (transaction.is_income) {
            transactionTypes.forEach(type => {
                if (type.name === 'Income') {
                    setSelectedTransactionType(type)
                }
            })
        } else {
            transactionTypes.forEach(type => {
                if (type.name === 'Expense') {
                    setSelectedTransactionType(type)
                }
            })
        }
    }, [transaction])

    useEffect(() => {
        if (!transfer) {
            return
        }
        transactionTypes.forEach(type => {
            if (type.name === 'Transfer') {
                setSelectedTransactionType(type)
            }
        })

        setSelectedAccount(transfer.from_transaction.account)
        setSelectedToAccount(transfer.to_transaction.account)
    }, [transfer])

    const deleteTransactionFromDb = async () => {
        if (!transaction) {
            return
        }

        if (transfer) {
            console.log('Deleting transfer transactions')
            await deleteTransaction(transfer.from_transaction)
            await deleteTransaction(transfer.to_transaction)
        } else {
            await deleteTransaction(transaction)
        }

        console.log('Transaction deleted')
        navigation.navigate('TransactionList')
    }

    const onDeleteItemPress = () => {
        Alert.alert(
            'Delete',
            'Delete this transaction ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteTransactionFromDb()
                }
            ]
        )
    }

    const onAddItemPress = async () => {
        if (!value) {
            Alert.alert('Transaction value cannot be empty')
            return
        }

        if (!selectedAccount) {
            Alert.alert('Account must be selected')
            return
        }

        if (!selectedCategory) {
            Alert.alert('Category must be selected')
            return
        }


        if (!transactionDate) {
            console.log('Transaction date not given')
            return
        }

        if (!transaction) {
            console.log('Transaction not available')
            return
        }

        if (!selectedTransactionType) {
            console.log('Type not defined')
            return
        }

        if (transfer) {
            console.log('Deleting transfer transactions')
            console.log(transfer)
            await deleteTransaction(transfer.from_transaction)
            await deleteTransaction(transfer.to_transaction)
        } else {
            await deleteTransaction(transaction)
        }

        const queryResult: any = await addTransaction({
            name: name,
            value: value,
            is_income: (selectedTransactionType.name === 'Income') ? true : false,
            account: selectedAccount,
            category: selectedCategory,
            transaction_date: transactionDate
        })

        if (selectedTransactionType.name === 'Transfer') {

            if (!selectedToAccount) {
                Alert.alert('To Account must be selected')
                return
            }

            if (selectedAccount === selectedToAccount) {
                Alert.alert('From and To Account cannot be the same')
                return
            }

            const secondQueryResult: any = await addTransaction({
                name: name,
                value: value,
                is_income: true,
                account: selectedToAccount,
                category: selectedCategory,
                transaction_date: transactionDate
            })

            await addTransfer({
                from_transaction: await getTransaction(queryResult['insertId']),
                to_transaction: await getTransaction(secondQueryResult['insertId'])
            })

        }

        console.log('Transaction saved')
        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Transaction' }}
            />
            {isLoading ? <ActivityIndicator size="large" color="#3e3b33" /> :
                <View>
                    {transactionTypes && selectedTransactionType &&
                        <TransactionTypeSelect
                            transactionTypes={transactionTypes}
                            selectedTransactionType={selectedTransactionType}
                            setSelectedTransactionType={setSelectedTransactionType}
                        />}
                    <Input
                        placeholder="Value"
                        leftIcon={{ type: 'material-icons', name: 'account-balance-wallet' }}
                        keyboardType="numeric"
                        onChangeText={setValue}
                        value={value}
                    />
                    {categories && selectedCategory && <CategorySelect
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />}
                    {accounts && selectedAccount && selectedTransactionType &&
                        <AccountSelect
                            accounts={accounts}
                            selectedAccount={selectedAccount}
                            setSelectedAccount={setSelectedAccount}
                            selectedTransactionType={selectedTransactionType}
                            isFromAccount={true}
                        />}
                    {accounts && selectedToAccount && selectedTransactionType && selectedTransactionType.name === 'Transfer' &&
                        <AccountSelect
                            accounts={accounts}
                            selectedAccount={selectedToAccount}
                            setSelectedAccount={setSelectedToAccount}
                            selectedTransactionType={selectedTransactionType}
                            isFromAccount={false}
                        />}
                    <Input
                        placeholder="Note (Optional)"
                        leftIcon={{ type: 'font-awesome', name: 'sticky-note' }}
                        onChangeText={setName}
                        value={name}
                    />
                    <Button title="Save" onPress={onAddItemPress} buttonStyle={styles.button} />
                    <Button title="Delete" onPress={onDeleteItemPress} buttonStyle={styles.button} />
                </View>}
        </View>
    )
}

export default EditTransaction

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {},
    disabled_input: {
        opacity: 1
    },
    button: {
        margin: 8
    }
})
