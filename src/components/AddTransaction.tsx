import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import { addTransaction, addTransfer, getAccounts, getCategories, getTransaction } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import { TransactionTypeInterface, types } from '../interfaces/TransactionInterface'
import AccountSelect from './AccountSelect'
import CategorySelect from './CategorySelect'


const AddTransaction = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date(route.params.transactionDate)

    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()

    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()

    const [typesExpanded, setTypesExpanded] = useState<boolean>(false)
    const [selectedType, setSelectedType] = useState<TransactionTypeInterface>(types[0])

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
        setTypesExpanded(!typesExpanded)
    }

    const onTypeIconPress = (type: TransactionTypeInterface) => {
        setSelectedType(type)
        setTypesExpanded(!typesExpanded)
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
                    placeholder={`Type: ${selectedType.name}`}
                    leftIcon={{ type: selectedType.icon_type, name: selectedType.icon_name }}
                    onChangeText={() => console.log('Type selected')}
                    style={styles.input}
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
            />
            {categories && selectedCategory && <CategorySelect
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />}
            {accounts && selectedAccount && selectedType && <AccountSelect
                accounts={accounts}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
                selectedType={selectedType}
                isFromAccount={true}
            />}
            {accounts && selectedToAccount && selectedType && selectedType.name === 'Transfer' && <AccountSelect
                accounts={accounts}
                selectedAccount={selectedToAccount}
                setSelectedAccount={setSelectedToAccount}
                selectedType={selectedType}
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
