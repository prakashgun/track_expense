import { ConnectionOptions, getConnection, getConnectionManager } from 'typeorm/browser'
import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'

const options: ConnectionOptions = {
    name: "default",
    type: "react-native",
    database: "trackexp",
    location: "default",
    logging: ["error", "query", "schema"],
    synchronize: false,
    migrationsRun: true,
    entities: [Account, Category, Transaction]
}

const connectionManager = getConnectionManager()

export default async () => {
    if (!connectionManager.has('default')) {
        console.log('Connection not exists.')
        connectionManager.create(options)
    }

    try {
        const db = connectionManager.get()
        console.log('Connecting db')
        await db.connect()
    } catch (error) {
        if (error.name === "CannotConnectAlreadyConnectedError") {
            console.log('Already db connected')
        } else {
            console.log('Error happened while connecting db')
            console.log(error)
        }
    }
}