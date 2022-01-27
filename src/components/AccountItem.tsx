import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { getCurrentBalance, roundCurrency, thousands_separators } from '../common/utils'
import AccountItemInterface from '../interfaces/AccountItemInterface'


const AccountItem = ({ account, onPress }: AccountItemInterface) => {
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
                <ListItem.Title>
                    {thousands_separators(roundCurrency(getCurrentBalance(account)))}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity >
}

export default AccountItem