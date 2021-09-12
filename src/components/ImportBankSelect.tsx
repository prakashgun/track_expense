import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Input, ListItem, Overlay, Text } from 'react-native-elements'
import ImportBankInterface from '../interfaces/ImportBankInterface'
import ImportBankSelectInterface from '../interfaces/ImportBankSelectInterface'


const ImportBankSelect = ({
    importBanks, selectedImportBank, setSelectedImportBank
}: ImportBankSelectInterface) => {

    const [importBanksExpanded, setImportBanksExpanded] = useState<boolean>(false)

    const toggleImportBanksOverlay = () => {
        setImportBanksExpanded(!importBanksExpanded)
    }

    const onImportBankIconPress = (importBank: ImportBankInterface) => {
        setSelectedImportBank(importBank)
        setImportBanksExpanded(!importBanksExpanded)
    }

    return (
        <View>
            <TouchableOpacity onPress={toggleImportBanksOverlay}>
                {selectedImportBank && <Input
                    placeholder={`Import Bank: ${selectedImportBank.name}`}
                    leftIcon={{ type: "font-awesome", name: "bank" }}
                    onChangeText={() => console.log('Type selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={importBanksExpanded} onBackdropPress={toggleImportBanksOverlay}>
                <Text h4>Select Import Bank</Text>
                <ScrollView>
                    {importBanks && importBanks.map((bank, i) => (
                        <ListItem key={i} onPress={() => onImportBankIconPress(bank)} bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title>{bank.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
        </View>
    )
}

export default ImportBankSelect

const styles = StyleSheet.create({
    input: {},
    disabled_input: {
        opacity: 1
    }
})
