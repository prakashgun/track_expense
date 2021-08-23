import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DbContext from '../context/DbContext'
import { createConnection, getRepository, Connection, getConnection } from 'typeorm/browser'
import { Author } from '../entities/author';
import { Category } from '../entities/category';
import { Post } from '../entities/post';
import setupConnection from '../common/setupConnection';


const AuthorC = () => {
    // const defaultConnection = useContext(DbContext)

    const fetchAuthor = async () => {
        try{
        const con = getConnection()
        }catch(error){
            console.log('Creating connection again')
            await setupConnection()
                      const authorRepository = getRepository(Author)
        let result = await authorRepository.find()
        console.log('Author:')
        console.log(result)
        }

    }

    useEffect(()=>{
        fetchAuthor()
    },[])

    return (
        <View>
            <Text>Author</Text>
        </View>
    )
}

export default AuthorC

const styles = StyleSheet.create({})
