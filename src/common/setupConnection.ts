import { useCallback } from 'react';
import { createConnection, getRepository, Connection } from 'typeorm/browser'
import { Author } from '../entities/author';
import { Category } from '../entities/category';
import { Post } from '../entities/post';

const setupConnection = async () => {
    try {
      const connection = await createConnection({
        type: 'react-native',
        database: 'author',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        synchronize: true,
        entities: [Author, Category, Post],
      });
    } catch (error) {
      console.log(error);
    }
  }

export default setupConnection  