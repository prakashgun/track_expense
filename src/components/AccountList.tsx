import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRepository } from 'typeorm/browser';
import dbConnect from '../common/dbConnect';
import { Account } from '../entities/Account';

const AccountList = () => {

    const getAccounts = async () => {
        await dbConnect()
        const accountRepository = getRepository(Account)
        let result = await accountRepository.find()
        console.log('Account:')
        console.log(result)
    }

    useEffect(() => {
        getAccounts()
    }, [])

    return (
        <View>
            <Text>AccountList</Text>
        </View>
    )
}

export default AccountList

const styles = StyleSheet.create({})
