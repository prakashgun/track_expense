import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { Header, Input } from 'react-native-elements'
import { readFile } from 'react-native-fs'
import { v4 as uuidv4 } from 'uuid'
import XLSX from 'xlsx'
import {
    addAccount, addCategory, addTransaction, addTransfer, getAccountByName, getAccounts,
    getCategories,
    getCategoryByName, getTransaction
} from '../common/dbQueries'
import { excelDateToUnixTimestamp } from '../common/utils'
import AccountInterface from '../interfaces/AccountInterface'
import CategoryInterface from '../interfaces/CategoryInterface'
import ImportBankInterface, { importBanks } from '../interfaces/ImportBankInterface'
import ImportRecordInterface from '../interfaces/ImportRecordInterface'
import AccountSelect from './AccountSelect'
import ImportBankSelect from './ImportBankSelect'


const ImportTransactions = ({ navigation, route }: any) => {
    const [accounts, setAccounts] = useState<AccountInterface[]>()
    const [categories, setCategories] = useState<CategoryInterface[]>()
    const [selectedToAccount, setSelectedToAccount] = useState<AccountInterface>()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImportBank, setSelectedImportBank] = useState(importBanks[0])
    const isFocused = useIsFocused()

    const setAccountsFromDb = async () => {
        setIsLoading(true)
        const allAccounts = await getAccounts()
        setAccounts(allAccounts)
        setCategories(await getCategories())

        if (allAccounts.length > 1) {
            setSelectedToAccount(allAccounts[1])
        } else {
            setSelectedToAccount(allAccounts[0])
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true)
            setAccountsFromDb()
            setIsLoading(false)
        }
    }, [isFocused])

    useEffect(() => {
        if (!accounts) {
            console.log('No accounts exist')
            return
        }

        // Incase the import bank name changes choose the matching account as to account
        for (const account of accounts) {
            if (selectedImportBank.name.toLowerCase() === account.name.toLowerCase()) {
                setSelectedToAccount(account)
            }
        }
    }, [selectedImportBank])

    const guessCategory = (note: string): string => {

        if (!categories) {
            throw 'No categories exist'
        }

        for (const category of categories) {
            if (category.name === 'Food') {
                const keywords = ['swiggy', 'zomato', 'food']
                // It should be food category if any of these food related words exist
                if (keywords.some(keyword => note.toLowerCase().includes(keyword))) {
                    return category.name
                }
            }
        }

        for (const category of categories) {
            if (category.name === 'Others') {
                return category.name
            }
        }

        console.log(`First category name ${categories[0].name}`)
        return categories[0].name
    }

    const addTransactionFromRecord = async (
        record: ImportRecordInterface,
        isIncome: boolean = false,
        isTransfer: boolean = false
    ): Promise<boolean> => {
        let account_name: string = ''

        account_name = isIncome ? record.income_or_transfer_in_account : record.expense_or_transfer_out_account


        let account: AccountInterface = await getAccountByName(account_name)

        if (!account) {
            console.log(`Creating non existant account: ${account_name}`)

            await addAccount({
                id: uuidv4(),
                name: account_name.trim(),
                initial_balance: 0
            })

            account = await getAccountByName(account_name)
        }

        let category: CategoryInterface = await getCategoryByName(record.category)

        if (!category) {
            console.log(`Creating non existant category: ${record.category}`)

            await addCategory({
                id: uuidv4(),
                name: record.category,
                icon_name: 'miscellaneous-services',
                icon_type: 'material-icons'
            })

            category = await getCategoryByName(record.category)
        }

        const from_transaction_id: string = uuidv4()

        await addTransaction({
            id: from_transaction_id,
            name: record.note,
            value: record.amount,
            is_income: isIncome,
            account: account,
            category: category,
            transaction_date: record.date
        })

        if (!isTransfer) {
            return true
        }

        if (record.income_or_transfer_in_account === record.expense_or_transfer_out_account) {
            console.log('From and to account cannot be the same in a transfer')
            return false
        }

        const to_transaction_id: string = uuidv4()
        account_name = record.income_or_transfer_in_account
        account = await getAccountByName(account_name)

        if (!account) {
            console.log(`Creating non existant account: ${account_name}`)

            await addAccount({
                id: uuidv4(),
                name: account_name.trim(),
                initial_balance: 0
            })

            account = await getAccountByName(account_name)
        }

        await addTransaction({
            id: to_transaction_id,
            name: record.note,
            value: record.amount,
            is_income: true,
            account: account,
            category: category,
            transaction_date: record.date
        })

        await addTransfer({
            id: uuidv4(),
            from_transaction: await getTransaction(from_transaction_id),
            to_transaction: await getTransaction(to_transaction_id)
        })

        return true
    }

    const insertRecords = async (records: ImportRecordInterface[]) => {
        console.log('Started inserting records')
        console.log(records)
        setIsLoading(true)

        for (const record of records) {
            if (record.system_generated_id) {
                if (await getTransaction(record.system_generated_id)) {

                }
            } else {

                if (!record.date || record.category === '' ||
                    (!record.expense_or_transfer_out_account && !record.income_or_transfer_in_account)) {
                    console.log('Invalid record skipping')
                    console.log(record)
                    continue
                }

                if (record.expense_or_transfer_out_account && record.income_or_transfer_in_account) {
                    await addTransactionFromRecord(record, false, true)
                } else if (!record.expense_or_transfer_out_account && record.income_or_transfer_in_account) {
                    await addTransactionFromRecord(record, true)
                } else if (record.expense_or_transfer_out_account && !record.income_or_transfer_in_account) {
                    await addTransactionFromRecord(record)
                } else {
                    console.log('Cannot identify expense type for this record:')
                    console.log(record)
                    continue
                }
            }
        }

        setIsLoading(false)
        Alert.alert('Completed')
    }

    const parseRecords = (selectedImportBank: ImportBankInterface, data: Array<any>): ImportRecordInterface[] => {
        let foundData: boolean = false, key_phrase: string, momentDate: moment.Moment
        let amount: number, expense_or_transfer_out_account: string, income_or_transfer_in_account: string
        let note: string = '', date_format: string = 'DD-MM-YYYY'
        let date_column: number, dr_column: number, cr_column: number, note_column: number
        let records: ImportRecordInterface[] = Array()
        let stringDate = true

        if (selectedImportBank.name == 'Other') {
            date_column = 0
            key_phrase = 'expense or transfer out account'

            data.forEach((line: any) => {
                let momentDate = moment(new Date(excelDateToUnixTimestamp(line[date_column]) * 1000))
                if (foundData) {
                    if (momentDate.isValid()) {
                        records.push({
                            date: momentDate.toDate(),
                            amount: parseFloat(line[1]),
                            category: line[2].trim(),
                            expense_or_transfer_out_account: line[3] !== undefined ? line[3].trim() : '',
                            income_or_transfer_in_account: line[4] !== undefined ? line[4].trim() : '',
                            note: line[5] !== undefined ? line[5].trim() : '',
                            system_generated_id: line[6] !== undefined ? line[6].trim() : ''
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
            case 'AXIS':
                key_phrase = 'Tran Date'
                date_column = 1
                note_column = 3
                dr_column = 4
                cr_column = 5
                date_format = 'DD-MM-YYYY'
                break
            case 'HDFC':
                key_phrase = 'Withdrawal Amt.'
                date_column = 0
                note_column = 1
                dr_column = 4
                cr_column = 5
                date_format = 'DD/MM/YY'
                break
            case 'ICICI':
                key_phrase = 'Value Date'
                date_column = 2
                note_column = 5
                dr_column = 6
                cr_column = 7
                date_format = 'DD/MM/YYYY'
                break
            case 'SBI':
                key_phrase = 'Txn Date'
                date_column = 0
                note_column = 2
                dr_column = 4
                cr_column = 5
                date_format = 'D M YYYY'
                stringDate = false
                break
            case 'Other':
                return records

            default:
                console.log('Unsupported import bank name')
                Alert.alert('Unsuported import bank name')
                return records
        }

        data.forEach((line: any) => {
            if (foundData) {
                // Convert the date string to moment object
                console.log('date_column')
                console.log(line[date_column])
                console.log('line')
                console.log(line)
                console.log('all items')
                console.log('--------------------')
                let i = 0
                for (const item of line) {
                    console.log(`'index: ${i}`)
                    console.log(item)
                    i++
                }
                console.log('length:')
                console.log(line.length)
                if (stringDate) {
                     momentDate = moment.utc(line[date_column], date_format)
                } else {
                     momentDate = moment(new Date(excelDateToUnixTimestamp(line[date_column]) * 1000))
                }

                if (momentDate.isValid()) {
                    console.log(line[date_column])
                    note = line[note_column].trim()
                    let dr_value: number = typeof line[dr_column] === 'string' ? parseFloat(line[dr_column].trim()) : line[dr_column]
                    let cr_value:number = typeof line[cr_column] === 'string' ? parseFloat(line[cr_column].trim()) : line[cr_column]

                    if (dr_value) {
                        amount = dr_value
                        expense_or_transfer_out_account = selectedImportBank.name
                        income_or_transfer_in_account = ''
                    } else {
                        amount = cr_value
                        expense_or_transfer_out_account = ''
                        income_or_transfer_in_account = selectedImportBank.name
                    }

                    records.push({
                        date: momentDate.toDate(),
                        amount: amount,
                        category: guessCategory(note),
                        expense_or_transfer_out_account: expense_or_transfer_out_account,
                        income_or_transfer_in_account: income_or_transfer_in_account,
                        note: note,
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
            {isLoading ? <ActivityIndicator size="large" color="#3e3b33" /> :
                <TouchableOpacity onPress={onSelectFilePress}>
                    <Input
                        placeholder='Select file to import (.xls, .xlsx)'
                        leftIcon={{ type: 'antdesign', name: 'select1' }}
                        style={styles.input}
                        disabled
                        disabledInputStyle={styles.disabled_input}
                    />
                </TouchableOpacity>}
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
