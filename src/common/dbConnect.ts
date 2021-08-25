import { ConnectionOptions, createConnection, getConnection } from 'typeorm/browser'
import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { Expense } from '../entities/Expense'

export default async () => {
    const options: ConnectionOptions = {
        name: "default",
        type: "react-native",
        database: "track_exp",
        location: "default",
        logging: ["error", "query", "schema"],
        synchronize: true,
        entities: [Account, Category, Expense]
    }

    try {
        await getConnection(options.name).close()
        return createConnection(options)
    } catch (error) {
        return createConnection(options)
    }
}