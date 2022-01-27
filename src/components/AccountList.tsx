import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Header } from 'react-native-elements'
import { getAccounts } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import AccountItem from './AccountItem'


const AccountList = ({navigation}:any) => {
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    // const isFocused = useIsFocused()

    // const setAccountsFromDb = async () => {
    //     setAccounts(await getAccounts())
    // }

    // useEffect(() => {
    //     if (isFocused) {
    //         setAccountsFromDb()
    //     }
    // }, [isFocused])

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
