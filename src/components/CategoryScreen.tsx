import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Header, PricingCard } from 'react-native-elements'
import { deleteCategory, getCategory } from '../common/dbQueries'
import CategoryInterface from '../interfaces/CategoryInterface'


const CategoryScreen = ({ navigation, route }:any) => {
    const [category, setCategory] = useState<CategoryInterface>()
    const isFocused = useIsFocused()

    const deleteCategoryFromDb = async () => {
        await deleteCategory(route.params.id)
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
                    onPress: () => deleteCategoryFromDb()
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
