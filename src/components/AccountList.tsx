import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { Account } from '../entities/Account'

interface AccountItemInterface {
    account: Account,
    onPress: () => void
}

const AccountItem = ({ account, onPress }: AccountItemInterface) => (
    <TouchableOpacity onPress={onPress}>
        <ListItem
            key={account.id}
            bottomDivider
        >
            <Icon name="bank" type="font-awesome" />
            <ListItem.Content>
                <ListItem.Title>{account.name}</ListItem.Title>
                <ListItem.Subtitle>{account.balance}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity>
)

const AccountList = () => {

    const navigation = useNavigation<any>()
    const [accounts, setAccounts] = useState<Account[]>()

    const getAccounts = async () => {
        await dbConnect()
        const accountRepository = getRepository(Account)
        setAccounts(await accountRepository.find({ take: 10000 }))
    }

    useEffect(() => {
        getAccounts()
    }, [])

    return (
        <View>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Accounts' }}
                />
                {
                    accounts && accounts.map((account) => (
                        <AccountItem
                            account={account}
                            key={account.id}
                            onPress={() => {
                                console.log('Account clicked')
                                return navigation.navigate('AccountScreen', { id: account.id })
                            }}
                        />
                    ))
                }
            </ScrollView>
            <Button title="Add" onPress={() => navigation.navigate('AddAccount')} />
        </View>
    )
}

export default AccountList

const styles = StyleSheet.create({})
