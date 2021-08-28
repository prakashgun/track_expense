import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { getAccounts, getCategories } from '../common/dbQueries'
import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'

const AddTransaction = () => {
    const navigation = useNavigation<any>()
    const [name, setName] = useState('')
    const [value, setValue] = useState(null)
    const [accountsExpanded, setAccountsExpanded] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<Account>()
    const [categoriesExpanded, setCategoriesExpanded] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category>()
    const [accounts, setAccounts] = useState<Account[]>()
    const [categories, setCategories] = useState<Category[]>()


    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        await setSelectedAccount(allAccounts[0])
    }

    const setCategoriesFromDb = async () => {
        const allCategories = await getCategories()
        setCategories(allCategories)
        await setSelectedCategory(allCategories[0])
    }

    useEffect(() => {
        if (isFocused) {
            setAccountsFromDb()
            setCategoriesFromDb()
        }
    }, [isFocused])

    const toggleCategoriesOverlay = () => {
        setCategoriesExpanded(!categoriesExpanded)
    }

    const toggleAccountsOverlay = () => {
        setAccountsExpanded(!accountsExpanded)
    }

    const onAccountIconPress = (account) => {
        console.log('account icon pressed: ', account)
        setSelectedAccount(account)
        setAccountsExpanded(!accountsExpanded)
    }

    const onCategoryIconPress = (category) => {
        console.log('category icon pressed: ', category)
        setSelectedCategory(category)
        setCategoriesExpanded(!categoriesExpanded)
    }

    const onAddItemPress = async () => {

        if (name.length < 2) {
            Alert.alert('Name should have atleast two characters')
            return
        }

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

        await dbConnect()
        const transactionRepository = getRepository(Transaction)

        try {
            const transaction = new Transaction()
            transaction.name = name
            transaction.value = value
            transaction.type = 'debit'
            transaction.account = selectedAccount
            transaction.category = selectedCategory
            await transactionRepository.save(transaction)
            console.log('Transaction saved')
        } catch (error) {
            console.log('Error in saving transaction')
            Alert.alert('Error in saving transaction. Please contact support.')
            console.log(error)
            return
        }

        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Transaction' }}
            />
            <Input
                placeholder="Name"
                leftIcon={{ type: 'font-awesome', name: 'bank' }}
                onChangeText={setName}
            />
            <Input
                placeholder="Value"
                leftIcon={{ type: 'material-icons', name: 'account-balance-wallet' }}
                keyboardType="numeric"
                onChangeText={setValue}
            />
            <TouchableOpacity onPress={toggleCategoriesOverlay}>
                {selectedCategory && <Input
                    placeholder={selectedCategory.name}
                    leftIcon={{ type: selectedCategory.icon_type, name: selectedCategory.icon_name }}
                    onChangeText={() => console.log('Catgeory selected')}
                    style={styles.input}
                    disabled
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={categoriesExpanded} onBackdropPress={toggleCategoriesOverlay}>
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
                    placeholder={selectedAccount.name}
                    leftIcon={{ type: "font-awesome", name: "bank" }}
                    onChangeText={() => console.log('Account selected')}
                    style={styles.input}
                    disabled
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={accountsExpanded} onBackdropPress={toggleAccountsOverlay}>
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
            <Button title="Save" onPress={onAddItemPress} />
        </View>
    )
}

export default AddTransaction

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {}
})
