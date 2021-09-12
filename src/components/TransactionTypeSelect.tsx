import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import TransactionTypeInterface from '../interfaces/TransactionTypeInterface'
import TransactionTypeSelectInterface from '../interfaces/TransactionTypeSelectInterface'


const TransactionTypeSelect = ({
    transactionTypes, selectedTransactionType, setSelectedTransactionType
}: TransactionTypeSelectInterface) => {

    const [transactionTypesExpanded, setTransactionTypesExpanded] = useState<boolean>(false)

    const toggleTransactionTypesOverlay = () => {
        setTransactionTypesExpanded(!transactionTypesExpanded)
    }

    const onTransactionTypeIconPress = (transactionType: TransactionTypeInterface) => {
        setSelectedTransactionType(transactionType)
        setTransactionTypesExpanded(!transactionTypesExpanded)
    }

    return (
        <View>
            <TouchableOpacity onPress={toggleTransactionTypesOverlay}>
                {selectedTransactionType && <Input
                    placeholder={`Type: ${selectedTransactionType.name}`}
                    leftIcon={{ type: selectedTransactionType.icon_type, name: selectedTransactionType.icon_name }}
                    onChangeText={() => console.log('Type selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={transactionTypesExpanded} onBackdropPress={toggleTransactionTypesOverlay}>
                <Text h4>Select Type</Text>
                <ScrollView>
                    {transactionTypes && transactionTypes.map((type, i) => (
                        <ListItem key={i} onPress={() => onTransactionTypeIconPress(type)} bottomDivider>
                            <Icon name={type.icon_name} type={type.icon_type} />
                            <ListItem.Content>
                                <ListItem.Title>{type.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
        </View>
    )
}

export default TransactionTypeSelect

const styles = StyleSheet.create({
    input: {},
    disabled_input: {
        opacity: 1
    }
})
