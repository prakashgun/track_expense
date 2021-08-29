import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay } from 'react-native-elements'
import { addTransaction, getAccounts, getCategories } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import { TransactionTypes } from '../interfaces/TransactionInterface'


const AddTransaction = () => {
    const navigation = useNavigation<any>()
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const [accountsExpanded, setAccountsExpanded] = useState<boolean>(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [categoriesExpanded, setCategoriesExpanded] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
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

    const onAccountIconPress = (account: AccountInterface) => {
        console.log('account icon pressed: ', account)
        setSelectedAccount(account)
        setAccountsExpanded(!accountsExpanded)
    }

    const onCategoryIconPress = (category: CategoryInterface) => {
        console.log('category icon pressed: ', category)
        setSelectedCategory(category)
        setCategoriesExpanded(!categoriesExpanded)
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

        await addTransaction({
            name: name,
            value: value,
            type: TransactionTypes.expense,
            account: selectedAccount,
            category: selectedCategory
        })

        console.log('Transaction saved')
        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Transaction' }}
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
            <Input
                placeholder="Name (Optional)"
                leftIcon={{ type: 'font-awesome', name: 'bank' }}
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
    input: {}
})
