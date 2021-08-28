import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Header, Icon, Input, ListItem, Overlay } from 'react-native-elements'
import { addCategory } from '../common/dbQueries'


const AddCategory = ({ navigation }: any) => {
    const [name, setName] = useState<string>('')
    const [iconSetExpanded, setIconSetExpanded] = useState<boolean>(false)

    const icons = [
        { icon_name: 'bowl', icon_type: 'entypo' },

        { icon_name: 'customerservice', icon_type: 'ant-design' },
        { icon_name: 'creditcard', icon_type: 'ant-design' },
        { icon_name: 'codesquareo', icon_type: 'ant-design' },
        { icon_name: 'book', icon_type: 'ant-design' },
        { icon_name: 'barschart', icon_type: 'ant-design' },
        { icon_name: 'bars', icon_type: 'ant-design' },
        { icon_name: 'clockcircle', icon_type: 'ant-design' },
        { icon_name: 'mail', icon_type: 'ant-design' },
        { icon_name: 'link', icon_type: 'ant-design' },
        { icon_name: 'home', icon_type: 'ant-design' },
        { icon_name: 'laptop', icon_type: 'ant-design' },
        { icon_name: 'star', icon_type: 'ant-design' },
        { icon_name: 'filter', icon_type: 'ant-design' },
        { icon_name: 'shoppingcart', icon_type: 'ant-design' },
        { icon_name: 'save', icon_type: 'ant-design' },
        { icon_name: 'user', icon_type: 'ant-design' },
        { icon_name: 'videocamera', icon_type: 'ant-design' },
        { icon_name: 'team', icon_type: 'ant-design' },
        { icon_name: 'sharealt', icon_type: 'ant-design' },
        { icon_name: 'setting', icon_type: 'ant-design' },
        { icon_name: 'picture', icon_type: 'ant-design' },
        { icon_name: 'tags', icon_type: 'ant-design' },
        { icon_name: 'cloud', icon_type: 'ant-design' },
        { icon_name: 'delete', icon_type: 'ant-design' },
        { icon_name: 'heart', icon_type: 'ant-design' },
        { icon_name: 'calculator', icon_type: 'ant-design' },

        { icon_name: 'archive', icon_type: 'entypo' },
        { icon_name: 'awareness-ribbon', icon_type: 'entypo' },
        { icon_name: 'baidu', icon_type: 'entypo' },
        { icon_name: 'basecamp', icon_type: 'entypo' },
        { icon_name: 'battery', icon_type: 'entypo' },
        { icon_name: 'bell', icon_type: 'entypo' },
        { icon_name: 'blackboard', icon_type: 'entypo' },
        { icon_name: 'block', icon_type: 'entypo' },
        { icon_name: 'book', icon_type: 'entypo' },
        { icon_name: 'bookmark', icon_type: 'entypo' },
        { icon_name: 'box', icon_type: 'entypo' },
        { icon_name: 'briefcase', icon_type: 'entypo' },
        { icon_name: 'brush', icon_type: 'entypo' },
        { icon_name: 'bucket', icon_type: 'entypo' },
        { icon_name: 'clapperboard', icon_type: 'entypo' },
        { icon_name: 'clipboard', icon_type: 'entypo' },
        { icon_name: 'colours', icon_type: 'entypo' },
    ]

    const [selectedIcon, setSelectedIcon] = useState(icons[0])

    const onIconPress = (icon: { icon_name: string, icon_type: string }) => {
        console.log('Icon pressed: ', icon)
        setSelectedIcon(icon)
        toggleCategoriesOverlay()
    }

    const toggleCategoriesOverlay = () => {
        setIconSetExpanded(!iconSetExpanded)
    }

    const onAddItemPress = async () => {

        if (name.length < 2) {
            Alert.alert('Name should have atleast two characters')
            return
        }

        if (!selectedIcon) {
            Alert.alert('Icon cannot be empty')
            return
        }

        await addCategory({
            name: name,
            icon_name: selectedIcon.icon_name,
            icon_type: selectedIcon.icon_type
        })

        console.log('Category saved')
        navigation.goBack()
    }

    return (
        <View>
            <Header
                leftComponent={{ onPress: () => navigation.navigate('Menu') }}
                centerComponent={{ text: 'Add Category' }}
            />
            <Input
                placeholder="Name"
                leftIcon={{ type: 'font-awesome', name: 'bank' }}
                onChangeText={setName}
            />

            <TouchableOpacity onPress={toggleCategoriesOverlay}>
                <Input
                    placeholder={selectedIcon.icon_name}
                    leftIcon={{ type: selectedIcon.icon_type, name: selectedIcon.icon_name }}
                    onChangeText={() => console.log('Icon selected')}
                    disabled
                />
            </TouchableOpacity>
            <Overlay fullScreen={true} isVisible={iconSetExpanded} onBackdropPress={toggleCategoriesOverlay}>
                <ScrollView>
                    {icons.map((icon, i) => (
                        <ListItem key={i} onPress={() => onIconPress(icon)} bottomDivider>
                            <Icon name={icon.icon_name} type={icon.icon_type} />
                            <ListItem.Content>
                                <ListItem.Title>{icon.icon_name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
            </Overlay>
            <Button title="Save" onPress={onAddItemPress} />
        </View>
    )
}

export default AddCategory

const styles = StyleSheet.create({})
