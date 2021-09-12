import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import { addTransaction, addTransfer, getAccounts, getCategories, getTransaction } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import TransactionTypeInterface, { transactionTypes } from '../interfaces/TransactionTypeInterface'
import AccountSelect from './AccountSelect'
import CategorySelect from './CategorySelect'


const AddTransaction = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date(route.params.transactionDate)

    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()

    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()

    const [transactionTypesExpanded, setTransactionTypesExpanded] = useState<boolean>(false)
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionTypeInterface>(transactionTypes[0])

    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        setSelectedAccount(allAccounts[0])
        setSelectedToAccount(allAccounts[0])
    }

    const setCategoriesFromDb = async () => {
        const allCategories = await getCategories()
        setCategories(allCategories)
        setSelectedCategory(allCategories[0])
    }

    const toggleTypesOverlay = () => {
        setTransactionTypesExpanded(!transactionTypesExpanded)
    }

    const onTypeIconPress = (type: TransactionTypeInterface) => {
        setSelectedTransactionType(type)
        setTransactionTypesExpanded(!transactionTypesExpanded)
    }

    useEffect(() => {
        if (isFocused) {
            setAccountsFromDb()
            setCategoriesFromDb()
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
            <TouchableOpacity onPress={toggleTypesOverlay}>
                {selectedTransactionType && <Input
                    placeholder={`Type: ${selectedTransactionType.name}`}
                    leftIcon={{ type: selectedTransactionType.icon_type, name: selectedTransactionType.icon_name }}
                    onChangeText={() => console.log('Type selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={transactionTypesExpanded} onBackdropPress={toggleTypesOverlay}>
                <Text h4>Select Type</Text>
                <ScrollView>
                    {transactionTypes && transactionTypes.map((type, i) => (
                        <ListItem key={i} onPress={() => onTypeIconPress(type)} bottomDivider>
                            <Icon name={type.icon_name} type={type.icon_type} />
                            <ListItem.Content>
                                <ListItem.Title>{type.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
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
