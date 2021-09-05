import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getAccounts } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import AccountItemInterface from '../interfaces/AccountItemInterface'


const AccountItem = ({ account, onPress }: AccountItemInterface) => {
    const [currentBalance, setCurrentBalance] = useState(0)

    useEffect(() => {
        if (account.total_income === undefined || account.total_expense === undefined) {
            return
        }

        setCurrentBalance(account.initial_balance + account.total_income - account.total_expense)
    }, [account])

    return < TouchableOpacity onPress={onPress} >
        <ListItem
            key={account.id}
            bottomDivider
        >
            <Icon name="bank" type="font-awesome" />
            <ListItem.Content>
                <ListItem.Title>{account.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title>{currentBalance}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity >
}

const AccountList = () => {

    const navigation = useNavigation<any>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        setAccounts(await getAccounts())
    }

    useEffect(() => {
        if (isFocused) {
            setAccountsFromDb()
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
