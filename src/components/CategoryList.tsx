import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getCategories } from '../common/dbQueries'
import { Category } from '../entities/Category'

interface CategoryItemInterface {
    category: Category,
    onPress: () => void
}

const CategoryItem = ({ category, onPress }: CategoryItemInterface) => (
    <TouchableOpacity onPress={onPress}>
        <ListItem
            key={category.id}
            bottomDivider
        >
            <Icon name={category.icon_name} type={category.icon_type} />
            <ListItem.Content>
                <ListItem.Title>{category.name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    </TouchableOpacity>
)

const CategoryList = () => {

    const navigation = useNavigation<any>()
    const [categories, setCategories] = useState<Category[]>()
    const isFocused = useIsFocused()

    const setCategoriesFromDb = async () => {
        setCategories(await getCategories())
    }

    useEffect(() => {
        if (isFocused) {
            setCategoriesFromDb()
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Categories' }}
            />
            <ScrollView >
                {
                    categories && categories.map((category) => (
                        <CategoryItem
                            category={category}
                            key={category.id}
                            onPress={() => {
                                return navigation.navigate('CategoryScreen', { id: category.id })
                            }}
                        />
                    ))
                }
            </ScrollView>
            <Button title="Add" onPress={() => navigation.navigate('AddCategory')} />
        </View>
    )
}

export default CategoryList

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
