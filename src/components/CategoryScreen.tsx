import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { getRepository } from 'typeorm/browser'
import dbConnect from '../common/dbConnect'
import { getCategory } from '../common/dbQueries'
import { Category } from '../entities/Category'

const CategoryScreen = ({ navigation, route }) => {
    const [category, setCategory] = useState<Category>()
    const isFocused = useIsFocused()

    const deleteCategory = async () => {
        await dbConnect()
        const categoryRepository = getRepository(Category)
        await categoryRepository.delete(route.params.id)
        console.log('Category deleted')
        navigation.navigate('CategoryList')
    }

    const setCategoryFromDb = async () => {
        setCategory(await getCategory(route.params.id))
    }

    useEffect(() => {
        if (isFocused) {
            setCategoryFromDb()
        }
    }, [isFocused])

    const onDeleteItemPress = () => {
        Alert.alert(
            'Delete',
            'Delete this category and all associated records ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteCategory()
                }
            ]
        )
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Category Detail' }}
            />
            {category && <PricingCard
                color="#3e3b33"
                title={category.name}
                button={{ title: 'Delete', onPress: () => onDeleteItemPress() }}
            />}
        </View>
    )
}

export default CategoryScreen

const styles = StyleSheet.create({})
