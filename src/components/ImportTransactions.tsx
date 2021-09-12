import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { Button, Header, Input } from 'react-native-elements'
import RNFetchBlob from 'rn-fetch-blob'
import { addTransaction, addTransfer, getAccounts, getCategories, getTransaction } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import { importBanks } from '../interfaces/ImportBankInterface'
import TransactionTypeInterface, { transactionTypes } from '../interfaces/TransactionTypeInterface'
import AccountSelect from './AccountSelect'
import ImportBankSelect from './ImportBankSelect'
import { writeFile, readFile } from 'react-native-fs'
import XLSX from 'xlsx'


const ImportTransactions = ({ navigation, route }: any) => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<any>()
    const transactionDate: Date = new Date()
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionTypeInterface>(transactionTypes[0])
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [selectedImportBank, setSelectedImportBank] = useState(importBanks[0])
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        setIsLoading(true)
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        setSelectedAccount(allAccounts[0])
        setSelectedToAccount(allAccounts[0])
        setIsLoading(false)
    }

    const setCategoriesFromDb = async () => {
        setIsLoading(true)
        const allCategories = await getCategories()
        setCategories(allCategories)
        setSelectedCategory(allCategories[0])
        setIsLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true)
            setAccountsFromDb()
            setCategoriesFromDb()
            setIsLoading(false)
        }
    }, [isFocused])

    const insertRecords = async (records: Array<Array<string>>) => {
        console.log('Started inserting records')
        console.log(records)
    }

    const onSelectFilePress = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
            })
            console.log(
                res
            )

            let records = new Array()

            readFile(res[0].uri, 'ascii').then((res) => {
                const wb = XLSX.read(res, { type: 'binary' })
                console.log('workbook is')
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
                let foundData = false
                const date_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/

                if (selectedImportBank.name == 'Axis') {
                    data.forEach((line: any) => {
                        if (foundData) {
                            if (date_regex.test(line[1])) {
                                records.push({
                                    date: line[1],
                                    note: line[3],
                                    dr: line[4],
                                    cr: [5]
                                })
                            } else {
                                foundData = false
                            }
                        }

                        if (line.includes('Tran Date')) {
                            foundData = true
                        }
                    })
                }else if(selectedImportBank.name=='HDFC'){
                    data.forEach((line: any) => {
                        if (foundData) {
                            if (date_regex.test(line[1])) {
                                records.push({
                                    date: line[0],
                                    note: line[1],
                                    dr: line[4],
                                    cr: [5]
                                })
                            }
                        }

                        if (line.includes('Withdrawal Amt.')) {
                            foundData = true
                        }
                    })
                }

                /* DO SOMETHING WITH workbook HERE */
            })

            // RNFetchBlob.fs.readFile(res[0].uri, 'utf8')
            //     .then((data) => {
            //         let lines = data.split('\n')
            //         let foundData = false
            //         const date_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/

            //         lines.forEach((line: string) => {
            //             let fields: Array<string> = line.split(',')

            //             console.log(fields)

            //             if (foundData) {
            //                 if (date_regex.test(fields[0])) {
            //                     console.log(fields)
            //                     records.push(fields)
            //                 } else {
            //                     foundData = false
            //                 }
            //             }

            //             if (fields.includes('Tran Date')) {
            //                 foundData = true
            //             }
            //         })

            //         if (records) {
            //             Alert.alert(
            //                 'Import',
            //                 `Import ${records.length} records from file ?`,
            //                 [
            //                     {
            //                         text: 'Cancel',
            //                         onPress: () => console.log('Cancel pressed'),
            //                         style: 'cancel'
            //                     },
            //                     {
            //                         text: 'OK',
            //                         onPress: () => insertRecords(records)
            //                     }
            //                 ]
            //             )
            //         } else {
            //             Alert.alert('No records exists in this file')
            //         }
            //     })
        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
                console.log('User cancelled document picker')
            } else {
                throw err
            }
        }

    }

    const onAddItemPress = async () => {
        if (!value) {
            Alert.alert('Transaction value cannot be empty')
            return
        }

        if (!selectedAccount) {
            Alert.alert('Account must be selected')
            return
        }

        if (!selectedCategory) {
            Alert.alert('Category must be selected')
            return
        }

        const queryResult: any = await addTransaction({
            name: name,
            value: value,
            is_income: (selectedTransactionType.name === 'Income') ? true : false,
            account: selectedAccount,
            category: selectedCategory,
            transaction_date: transactionDate
        })

        if (selectedTransactionType.name === 'Transfer') {

            if (!selectedToAccount) {
                Alert.alert('To Account must be selected')
                return
            }

            if (selectedAccount === selectedToAccount) {
                Alert.alert('From and To Account cannot be the same')
                return
            }

            const secondQueryResult: any = await addTransaction({
                name: name,
                value: value,
                is_income: true,
                account: selectedToAccount,
                category: selectedCategory,
                transaction_date: transactionDate
            })

            await addTransfer({
                from_transaction: await getTransaction(queryResult['insertId']),
                to_transaction: await getTransaction(secondQueryResult['insertId'])
            })

        }

        console.log('Transaction saved')
        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Transaction' }}
            />
            {importBanks && selectedImportBank &&
                <ImportBankSelect
                    importBanks={importBanks}
                    selectedImportBank={selectedImportBank}
                    setSelectedImportBank={setSelectedImportBank}
                />}
            {accounts && selectedToAccount &&
                <AccountSelect
                    accounts={accounts}
                    selectedAccount={selectedToAccount}
                    setSelectedAccount={setSelectedToAccount}
                    isFromAccount={false}
                />}
            <TouchableOpacity onPress={onSelectFilePress}>
                <Input
                    placeholder='Select file to import (.xls, .xlsx)'
                    leftIcon={{ type: 'antdesign', name: 'select1' }}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />
            </TouchableOpacity>
        </View>
    )
}

export default ImportTransactions

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {},
    disabled_input: {
        opacity: 1
    }
})
