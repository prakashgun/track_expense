import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Header, Input } from 'react-native-elements'
import { addAccount } from '../common/dbQueries'
import { v4 as uuidv4 } from 'uuid'


const AddAccount = () => {
    const navigation = useNavigation<any>()
    const [name, setName] = useState<string>('')
    const [balance, setBalance] = useState<any>()

    const onAddItemPress = async () => {

        if (name.length < 2) {
            Alert.alert('Name should have atleast two characters')
            return
        }

        if (!balance) {
            Alert.alert('Account balance cannot be empty')
            return
        }

        await addAccount({
            id: uuidv4(),
            name: name,
            initial_balance: balance
        })

        console.log('Account saved')
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
