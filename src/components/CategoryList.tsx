import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
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

    const getCategories = async () => {
        await dbConnect()
        const categoryRepository = getRepository(Category)
        setCategories(await categoryRepository.find({ take: 10000 }))
    }

    useEffect(() => {
        if (isFocused) {
            getCategories()
            console.log('getCategories')
        }
    }, [isFocused])

    return (
        <View>
            <ScrollView >
                <Header
                    leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                    centerComponent={{ text: 'Categories' }}
                />
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

const styles = StyleSheet.create({})
