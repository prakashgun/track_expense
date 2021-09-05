import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import { addTransaction, addTransfer, deleteTransaction, getAccounts, getCategories, getTransaction, getTransfer } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import TransactionInterface, { TransactionTypeInterface, types } from '../interfaces/TransactionInterface'
import TransferInterface from '../interfaces/TransferInterface'


const EditTransaction = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date(route.params.transactionDate)

    const [accountsExpanded, setAccountsExpanded] = useState<boolean>(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()

    const [toAccountsExpanded, setToAccountsExpanded] = useState<boolean>(false)
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()

    const [typesExpanded, setTypesExpanded] = useState<boolean>(false)
    const [selectedType, setSelectedType] = useState<TransactionTypeInterface>()

    const [categoriesExpanded, setCategoriesExpanded] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [categories, setCategories] = useState<CategoryInterface[]>()

    const [transaction, setTransaction] = useState<TransactionInterface>()
    const [transfer, setTransfer] = useState<TransferInterface>()

    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        setSelectedAccount(allAccounts[0])
        setSelectedToAccount(allAccounts[0])
    }

    const toggleAccountsOverlay = () => {
        setAccountsExpanded(!accountsExpanded)
    }

    const onAccountIconPress = (account: AccountInterface) => {
        setSelectedAccount(account)
        setAccountsExpanded(!accountsExpanded)
    }

    const toggleToAccountsOverlay = () => {
        setToAccountsExpanded(!toAccountsExpanded)
    }

    const onToAccountIconPress = (account: AccountInterface) => {
        setSelectedToAccount(account)
        setToAccountsExpanded(!toAccountsExpanded)
    }

    const setCategoriesFromDb = async () => {
        const allCategories = await getCategories()
        setCategories(allCategories)
        setSelectedCategory(allCategories[0])
    }

    const toggleCategoriesOverlay = () => {
        setCategoriesExpanded(!categoriesExpanded)
    }

    const onCategoryIconPress = (category: CategoryInterface) => {
        setSelectedCategory(category)
        setCategoriesExpanded(!categoriesExpanded)
    }

    const toggleTypesOverlay = () => {
        setTypesExpanded(!typesExpanded)
    }

    const onTypeIconPress = (type: TransactionTypeInterface) => {
        setSelectedType(type)
        setTypesExpanded(!typesExpanded)
    }

    const setTransactionFromDb = async () => {
        setTransaction(await getTransaction(route.params.id))
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
            types.forEach(type => {
                if (type.name === 'Income') {
                    setSelectedType(type)
                }
            })
        } else {
            types.forEach(type => {
                if (type.name === 'Expense') {
                    setSelectedType(type)
                }
            })
        }
    }, [transaction])

    useEffect(() => {
        if (!transfer) {
            return
        }
        types.forEach(type => {
            if (type.name === 'Transfer') {
                setSelectedType(type)
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

        if (!selectedType) {
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
            is_income: (selectedType.name === 'Income') ? true : false,
            account: selectedAccount,
            category: selectedCategory,
            transaction_date: transactionDate
        })

        if (selectedType.name === 'Transfer') {

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
                {selectedType && <Input
                    placeholder={selectedType.name}
                    leftIcon={{ type: selectedType.icon_type, name: selectedType.icon_name }}
                    onChangeText={() => console.log('Type selected')}
                    style={styles.input}
                    value={selectedType.name}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={typesExpanded} onBackdropPress={toggleTypesOverlay}>
                <Text h4>Select Type</Text>
                <ScrollView>
                    {types && types.map((type, i) => (
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
                value={value}
            />
            <TouchableOpacity onPress={toggleCategoriesOverlay}>
                {selectedCategory && <Input
                    placeholder={`Category: ${selectedCategory.name}`}
                    leftIcon={{ type: selectedCategory.icon_type, name: selectedCategory.icon_name }}
                    onChangeText={() => console.log('Catgeory selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={categoriesExpanded} onBackdropPress={toggleCategoriesOverlay}>
                <Text h4>Select Category</Text>
                <ScrollView>
                    {categories && categories.map((category, i) => (
                        <ListItem key={i} onPress={() => onCategoryIconPress(category)} bottomDivider>
                            <Icon name={category.icon_name} type={category.icon_type} />
                            <ListItem.Content>
                                <ListItem.Title>{category.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
            <TouchableOpacity onPress={toggleAccountsOverlay}>
                {selectedAccount && <Input
                    placeholder={(selectedType && selectedType.name === 'Transfer' ? 'From ' : '') + 'Account: ' + selectedAccount.name}
                    leftIcon={{ type: "font-awesome", name: "bank" }}
                    onChangeText={() => console.log('Account selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={accountsExpanded} onBackdropPress={toggleAccountsOverlay}>
                <Text h4>Select Account</Text>
                <ScrollView>
                    {accounts && accounts.map((account, i) => (
                        <ListItem key={i} onPress={() => onAccountIconPress(account)} bottomDivider>
                            <Icon name="bank" type="font-awesome" />
                            <ListItem.Content>
                                <ListItem.Title>{account.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
            {selectedType && selectedType.name === 'Transfer' && <View>
                <TouchableOpacity onPress={toggleToAccountsOverlay}>
                    {selectedToAccount && <Input
                        placeholder={(selectedType && selectedType.name === 'Transfer' ? 'To ' : '') + 'Account: ' + selectedToAccount.name}
                        leftIcon={{ type: "font-awesome", name: "bank" }}
                        onChangeText={() => console.log('ToAccount selected')}
                        style={styles.input}
                        disabled
                        disabledInputStyle={styles.disabled_input}
                    />}
                </TouchableOpacity>
                <Overlay fullScreen={true} isVisible={toAccountsExpanded} onBackdropPress={toggleToAccountsOverlay}>
                    <Text h4>Select Account</Text>
                    <ScrollView>
                        {accounts && accounts.map((account, i) => (
                            <ListItem key={i} onPress={() => onToAccountIconPress(account)} bottomDivider>
                                <Icon name="bank" type="font-awesome" />
                                <ListItem.Content>
                                    <ListItem.Title>{account.name}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView>
                </Overlay>
            </View>}
            <Input
                placeholder="Note (Optional)"
                leftIcon={{ type: 'font-awesome', name: 'sticky-note' }}
                onChangeText={setName}
                value={name}
            />
            <Button title="Save" onPress={onAddItemPress} buttonStyle={styles.button} />
            <Button title="Delete" onPress={onDeleteItemPress} buttonStyle={styles.button} />
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
