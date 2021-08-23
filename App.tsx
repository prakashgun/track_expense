import React, { useCallback, useEffect, ReactNode, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { createConnection, getRepository, Connection } from 'typeorm/browser';
import DbContext from './src/context/DbContext';

import { Author } from './src/entities/author';
import { Category } from './src/entities/category';
import { Post } from './src/entities/post';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import AuthorC from './src/components/Author'
import setupConnection from './src/common/setupConnection'

const Stack = createNativeStackNavigator();

const AuthorTile = ({
  name,
  birthdate,
}: {
  name: string;
  birthdate: string;
}) => {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{birthdate}</Text>
    </View>
  );
};

const App: () => ReactNode = () => {
  const [defaultConnection, setconnection] = useState<Connection | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  

  const getAuthors = async () => {
    const authorRepository = getRepository(Author);
    let result = await authorRepository.find();
    if (result.length === 0) {
      const newAuthor = new Author();
      newAuthor.birthdate = '10-03-1940';
      newAuthor.name = 'Chuck Norris';
      await authorRepository.save(newAuthor);
      result = await authorRepository.find();
    }
    setAuthors(result);
  }

  useEffect(() => {
    if (!defaultConnection) {
      setupConnection();
    } else {
      getAuthors();
    }
  }, []);

  return (
    <DbContext.Provider value={{ defaultConnection }}>
      <View style={styles.container}>
        <Text style={styles.title}>My List of Authors</Text>
        {authors.map((author) => (
          <AuthorTile key={author.id.toString()} name={author.name}
            birthdate={author.birthdate} />
        ))}
      </View>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Author" component={AuthorC} />
        </Stack.Navigator>
      </NavigationContainer>
    </DbContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, color: 'black' },
});

export default App;