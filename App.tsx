import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import db from './src/common/db'
import { createTables, generateDefaultData, getCategories } from './src/common/dbQueries'

export default function App() {

  const printCategories = async ()=> {
    await createTables(db)
    await generateDefaultData(db)
    console.log('Categories are:')
    console.log(await getCategories(db))
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
