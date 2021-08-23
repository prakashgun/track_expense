import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DbContext from '../context/DbContext'
import { createConnection, getRepository, Connection, getConnection } from 'typeorm/browser'
import { Author } from '../entities/author';
import { Category } from '../entities/category';
import { Post } from '../entities/post';


const AuthorC = () => {
    // const defaultConnection = useContext(DbContext)

    const fetchAuthor = async () => {
        try{
        const con = getConnection()
        }catch(error){
            console.log('Creating connection again')
            await createConnection({
                type: 'react-native',
                database: 'author',
                location: 'default',
                logging: ['error', 'query', 'schema'],
                synchronize: true,
                entities: [Author, Category, Post],
              })
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
