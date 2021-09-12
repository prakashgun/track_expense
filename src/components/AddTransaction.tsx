import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { Button, Header, Input } from 'react-native-elements'
import { addTransaction, addTransfer, getAccounts, getCategories, getTransaction } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import TransactionTypeInterface, { transactionTypes } from '../interfaces/TransactionTypeInterface'
import AccountSelect from './AccountSelect'
import CategorySelect from './CategorySelect'
import TransactionTypeSelect from './TransactionTypeSelect'


const AddTransaction = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date(route.params.transactionDate)
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionTypeInterface>(transactionTypes[0])
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
    const [isLoading, setIsLoading] = useState(true)
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        setIsLoading(true)
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        setSelectedAccount(allAccounts[0])
        setSelectedToAccount(allAccounts[0])
        setIsLoading(false)
    }

    const setCategoriesFromDb = async () => {
        setIsLoading(true)
        const allCategories = await getCategories()
        setCategories(allCategories)
        setSelectedCategory(allCategories[0])
        setIsLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true)
            setAccountsFromDb()
            setCategoriesFromDb()
            setIsLoading(false)
        }
    }, [isFocused])

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
                    />
                    <Button title="Save" onPress={onAddItemPress} />
                </View>}
        </View>
    )
}

export default AddTransaction

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {},
    disabled_input: {
        opacity: 1
    }
})
