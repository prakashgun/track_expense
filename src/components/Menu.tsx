
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements'


const Menu = () => {
    const navigation = useNavigation()
    
    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Menu' }}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('AccountList')}
            >
                <ListItem key="AccountList" bottomDivider>
                    <Icon name="bank" type="font-awesome" />
                    <ListItem.Content>
                        <ListItem.Title>Accounts</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('CategoryList')}
            >
                <ListItem key="CategoryList" bottomDivider>
                    <Icon name="category" type="material-icons" />
                    <ListItem.Content>
                        <ListItem.Title>Categories</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('ExpenseList')}
            >
                <ListItem key="ExpenseList" bottomDivider>
                    <Icon name="price-tag" type="entypo" />
                    <ListItem.Content>
                        <ListItem.Title>Expenses</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
        </View>
    )
}

export default Menu