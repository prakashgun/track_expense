import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { Header, Input } from 'react-native-elements'
import { readFile } from 'react-native-fs'
import XLSX from 'xlsx'
import { getAccounts, getCategories } from '../common/dbQueries'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import ImportBankInterface, { importBanks } from '../interfaces/ImportBankInterface'
import ImportRecordInterface from '../interfaces/ImportRecordInterface'
import AccountSelect from './AccountSelect'
import ImportBankSelect from './ImportBankSelect'


const ImportTransactions = ({ navigation, route }: any) => {
    const [selectedAccount, setSelectedAccount] = useState<AccountInterface>()
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()
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

        if (allAccounts.length > 1) {
            setSelectedToAccount(allAccounts[1])
        } else {
            setSelectedToAccount(allAccounts[0])
        }

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

    const parseRecords = (selectedImportBank: ImportBankInterface, data: Array<any>): ImportRecordInterface[] => {
        let foundData: boolean = false, key_phrase: string
        let amount: number, expense_or_transfer_out_account: string, income_or_transfer_in_account: string
        let category_name: string
        let date_column: number, dr_column: number, cr_column: number, note_column: number
        const date_regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        let records: ImportRecordInterface[] = Array()

        console.log(selectedImportBank.name)
        if (selectedImportBank.name == 'Other') {
            date_column = 0
            key_phrase = 'expense or transfer out account'

            data.forEach((line: any) => {
                console.log(line)
                if (foundData) {
                    if (date_regex.test(line[date_column])) {
                        records.push({
                            date: line[date_column].trim(),
                            amount: parseFloat(line[1]),
                            category: line[2].trim(),
                            expense_or_transfer_out_account: line[3] !== undefined ? line[3].trim(): '',
                            income_or_transfer_in_account: line[4] !== undefined ? line[4].trim(): '',
                            note: line[5] !== undefined ? line[5].trim(): '',
                            system_generated_id: line[6] !== undefined ? line[6].trim(): ''
                        })
                    } else {
                        foundData = false
                    }
                }

                if (line.includes(key_phrase)) {
                    foundData = true
                }
            })

            return records
        }

        switch (selectedImportBank.name) {
            case 'Axis':
                key_phrase = 'Tran Date'
                category_name = 'Others'
                date_column = 1
                note_column = 3
                dr_column = 4
                cr_column = 5
                break
            case 'HDFC':
                key_phrase = 'Withdrawal Amt.'
                category_name = 'Others'
                date_column = 0
                note_column = 1
                dr_column = 4
                cr_column = 5
                break
            case 'Icici':
                key_phrase = 'Value Date'
                category_name = 'Others'
                date_column = 2
                note_column = 4
                dr_column = 6
                cr_column = 7
                break

            default:
                return records
        }

        data.forEach((line: any) => {
            if (foundData) {
                if (date_regex.test(line[date_column])) {
                    if (line[dr_column]) {
                        amount = parseFloat(line[dr_column])
                        expense_or_transfer_out_account = selectedImportBank.name
                        income_or_transfer_in_account = ''
                    } else {
                        amount = parseFloat(line[cr_column])
                        expense_or_transfer_out_account = ''
                        income_or_transfer_in_account = selectedImportBank.name
                    }

                    records.push({
                        date: line[date_column].trim(),
                        amount: amount,
                        category: category_name,
                        expense_or_transfer_out_account: expense_or_transfer_out_account,
                        income_or_transfer_in_account: income_or_transfer_in_account,
                        note: line[note_column].trim(),
                        system_generated_id: ''
                    })
                }
            }

            if (line.includes(key_phrase)) {
                foundData = true
            }
        })

        return records
    }

    const onSelectFilePress = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
            })

            let records = new Array()

            readFile(res[0].uri, 'ascii').then((res) => {
                const wb = XLSX.read(res, { type: 'binary' })
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
                // Took from https://stackoverflow.com/a/15504877/6842203
                records = parseRecords(selectedImportBank, data)

                console.log('records')
                console.log(records)

                if (records) {
                    Alert.alert(
                        'Import',
                        `Import ${records.length} records from file ?`,
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel pressed'),
                                style: 'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => insertRecords(records)
                            }
                        ]
                    )
                } else {
                    Alert.alert('No records exists in this file')
                }

            })

        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
                console.log('User cancelled document picker')
            } else {
                throw err
            }
        }

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
            {selectedImportBank.name !== 'Other' && accounts && selectedToAccount &&
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
