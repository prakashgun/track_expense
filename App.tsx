import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { createTables, generateDefaultData, getCategories } from './src/common/dbQueries'

export default function App() {

  const printCategories = async () => {
    await createTables()
    await generateDefaultData()
    console.log('Categories are:')
    console.log(await getCategories())
  }

  useEffect(() => {

    printCategories()
  }, [])

  return (
    <View>
      <Text>App</Text>
    </View>
  )
}
