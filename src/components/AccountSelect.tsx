import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import AccountInterface from '../interfaces/AccountInterface'
import AccountSelectInterface from '../interfaces/AccountSelectInterface'


const AccountSelect = ({ accounts, selectedAccount, setSelectedAccount, selectedType, isFromAccount = true }: AccountSelectInterface) => {

    const [accountsExpanded, setAccountsExpanded] = useState<boolean>(false)
    let placeholder = 'Account:'

    if (selectedType && selectedType.name) {
        if (selectedType.name === 'Transfer') {
            placeholder = isFromAccount ? 'From Account:' : 'To Account:'
        }
    }

    const toggleAccountsOverlay = () => {
        setAccountsExpanded(!accountsExpanded)
    }

    const onAccountIconPress = (account: AccountInterface) => {
        setSelectedAccount(account)
        setAccountsExpanded(!accountsExpanded)
    }

    return (
        <View>
            <TouchableOpacity onPress={toggleAccountsOverlay}>
                {selectedAccount && <Input
                    placeholder={placeholder + ' ' + selectedAccount.name}
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
        </View>
    )
}

export default AccountSelect

const styles = StyleSheet.create({
    input: {},
    disabled_input: {
        opacity: 1
    }
})
