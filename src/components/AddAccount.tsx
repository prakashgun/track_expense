import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Header, Input } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { Account } from '../entities/Account'

const AddAccount = () => {
    const navigation = useNavigation<any>()
    const [name, setName] = useState('')
    const [balance, setBalance] = useState(null)

    const onAddItemPress = async () => {

        if (name.length < 2) {
            Alert.alert('Name should have atleast two characters')
            return
        }

        if (!balance) {
            Alert.alert('Account balance cannot be empty')
            return
        }

        await dbConnect()
        const accountRepository = getRepository(Account)

        try {
            const account = new Account()
            account.name = name
            account.balance = balance
            await accountRepository.save(account)
            console.log('Account saved')
        } catch (error) {
            console.log('Error in saving account')
            Alert.alert('Error in saving account. Please contact support.')
            console.log(error)
            return
        }

        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Account' }}
            />
            <Input
                placeholder="Name"
                leftIcon={{ type: 'font-awesome', name: 'bank' }}
                onChangeText={setName}
            />
            <Input
                placeholder="Balance"
                leftIcon={{ type: 'material-icons', name: 'account-balance-wallet' }}
                keyboardType="numeric"
                onChangeText={setBalance}
            />
            <Button title="Save" onPress={onAddItemPress} />
        </View>
    )
}

export default AddAccount

const styles = StyleSheet.create({})
