import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Input, ListItem, Overlay, Text } from 'react-native-elements'
import CategoryInterface from '../interfaces/CategoryInterface'
import CategorySelectInterface from '../interfaces/CategorySelectInterface'


const CategorySelect = ({ categories, selectedCategory, setSelectedCategory }: CategorySelectInterface) => {

    const [categoriesExpanded, setCategoriesExpanded] = useState<boolean>(false)

    const toggleCategoriesOverlay = () => {
        setCategoriesExpanded(!categoriesExpanded)
    }

    const onCategoryIconPress = (category: CategoryInterface) => {
        setSelectedCategory(category)
        setCategoriesExpanded(!categoriesExpanded)
    }

    return (
        <View>
            <TouchableOpacity onPress={toggleCategoriesOverlay}>
                {selectedCategory && <Input
                    placeholder={`Category: ${selectedCategory.name}`}
                    leftIcon={{ type: selectedCategory.icon_type, name: selectedCategory.icon_name }}
                    onChangeText={() => console.log('Catgeory selected')}
                    style={styles.input}
                    disabled
                    disabledInputStyle={styles.disabled_input}
                />}
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={categoriesExpanded} onBackdropPress={toggleCategoriesOverlay}>
                <Text h4>Select Category</Text>
                <ScrollView>
                    {categories && categories.map((category, i) => (
                        <ListItem key={i} onPress={() => onCategoryIconPress(category)} bottomDivider>
                            <Icon name={category.icon_name} type={category.icon_type} />
                            <ListItem.Content>
                                <ListItem.Title>{category.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
        </View>
    )
}

export default CategorySelect

const styles = StyleSheet.create({
    input: {},
    disabled_input: {
        opacity: 1
    }
})
