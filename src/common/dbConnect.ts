import { createConnection, getConnection } from "typeorm/browser"
import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { Expense } from '../entities/Expense'

const setupConnection = async () => {
    try {
        return await createConnection({
            type: 'react-native',
            database: 'tract_exp',
            location: 'default',
            logging: ['error', 'query', 'schema'],
            synchronize: true,
            entities: [Account, Category, Expense],
        })
    } catch (error) {
        console.log(error)
    }
}

export default async () => {
    try {
        const connection = await getConnection()
        if (!connection.isConnected) {
            await connection.connect()
        }
    } catch (error) {
        console.log('Creating connection again')
        await setupConnection()
    }
}