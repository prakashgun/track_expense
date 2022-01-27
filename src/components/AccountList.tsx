import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header } from 'react-native-elements'


const AccountList = ({ navigation }: any) => {

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Accounts' }}
            />
            <Text>Account List</Text>
        </View>
    )
}

export default AccountList

const styles = StyleSheet.create({})
