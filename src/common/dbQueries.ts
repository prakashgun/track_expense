import AccountInterface from "../interfaces/AccountInterface"
import CategoryInterface from "../interfaces/CategoryInterface"
import TransactionInterface from "../interfaces/TransactionInterface"
import TransferInterface from "../interfaces/TransferInterface"
import db from "./db"
import { defaultCategories } from "./defaultData"
import { frameDbDate, frameDbDateTime } from "./utils"

const executeQuery = (sql: string, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => {
        trans.executeSql(sql, params, (trans, results) => {
            resolve(results)
        },
            (error) => {
                console.log(error)
                reject(error)
            })
    })
})

const itemsFromResult = (result: any) => {
    const items = []
    const rows = result.rows

    for (let i = 0; i < rows.length; i++) {
        let item = rows.item(i)
        items.push(item)
    }

    return items
}

const itemFromResult = (result: any) => {
    return result.rows.item(0)
}

const sumFromResult = (result: any) => {
    const rows = result.rows
    let item = rows.item(0)
    let sum = 0

    if(!item['sum(value)']){
        return sum
    }

    return parseFloat(item['sum(value)'])
}

export const createTables = async () => {
    // console.log('Dropping tables')
    // await executeQuery('DROP TABLE IF EXISTS accounts')
    // await executeQuery('DROP TABLE IF EXISTS categories')
    // await executeQuery('DROP TABLE IF EXISTS transactions')
    // await executeQuery('DROP TABLE IF EXISTS transfers')

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            initial_balance REAL NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
    )

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            icon_name TEXT NOT NULL,
            icon_type TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
    )

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            value REAL NOT NULL,
            is_income BOOLEAN DEFAULT(FALSE),
            account_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            transaction_date DATETIME NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE,
            FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
        )`
    )

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS transfers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_id INTEGER NOT NULL,
            to_id INTEGER NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(from_id) REFERENCES transactions(id) ON DELETE CASCADE,
            FOREIGN KEY(to_id) REFERENCES transactions(id) ON DELETE CASCADE
        )`
    )
}

export const generateDefaultData = async () => {

    const accountsResult: any = await executeQuery(
        `SELECT COUNT(*) as count FROM accounts`
    )

    if (accountsResult.rows.item(0)['count'] == 0) {
        console.log('Generating default accounts')

        await executeQuery(
            `INSERT INTO accounts (name, initial_balance) VALUES ('Cash', 0)`
        )
    }

    const categoriesResult: any = await executeQuery(
        `SELECT COUNT(*) as count FROM categories`
    )

    if (categoriesResult.rows.item(0)['count'] == 0) {
        console.log('Generating default categories')

        let categoryQuery = 'INSERT INTO categories (name, icon_name, icon_type) VALUES '

        defaultCategories.forEach((defaultCategory, key, arr) => {
            categoryQuery += `(
                '${defaultCategory.name}', 
                '${defaultCategory.icon_name}', 
                '${defaultCategory.icon_type}')`

            if (key !== arr.length - 1) {
                categoryQuery += ','
            }
        })

        await executeQuery(categoryQuery)
    }
}

export const getAccounts = async (): Promise<AccountInterface[]> => {
    const result: any = await executeQuery(
        `SELECT * FROM accounts`
    )

    const items = []
    const rows = result.rows


    for (let i = 0; i < rows.length; i++) {
        let item = rows.item(i)
        item['total_expense'] = await getTotalExpense(item)
        item['total_income'] = await getTotalIncome(item)
        items.push(item)
    }

    return items
}

export const addAccount = async (account: AccountInterface) => {
    await executeQuery(
        `INSERT INTO accounts (name, initial_balance) VALUES ('${account.name}', ${account.initial_balance})`
    )
}

export const getAccount = async (id: number): Promise<AccountInterface> => {
    const result: any = await executeQuery(
        `SELECT * FROM accounts WHERE id=${id}`
    )

    return itemFromResult(result)
}

export const deleteAccount = async (id: number) => {
    await executeQuery(
        `DELETE FROM accounts WHERE id=${id}`
    )
}

export const getCategories = async (): Promise<CategoryInterface[]> => {
    const result: any = await executeQuery(
        `SELECT * FROM categories`
    )

    return itemsFromResult(result)
}

export const addCategory = async (category: CategoryInterface) => {
    await executeQuery(
        `INSERT INTO categories (name, icon_name, icon_type) VALUES 
            ('${category.name}', '${category.icon_name}', '${category.icon_type}')`
    )
}

export const getCategory = async (id: number): Promise<CategoryInterface> => {
    const result: any = await executeQuery(
        `SELECT * FROM categories WHERE id=${id}`
    )

    return itemFromResult(result)
}

export const deleteCategory = async (id: number) => {
    await executeQuery(
        `DELETE FROM categories WHERE id=${id}`
    )
}

export const getTransactions = async (date: Date): Promise<TransactionInterface[]> => {
    const result: any = await executeQuery(
        `SELECT transactions.*, transfers.from_id, transfers.to_id FROM transactions
            LEFT JOIN transfers 
                ON transactions.id = transfers.from_id OR transactions.id = transfers.to_id
            WHERE DATE(transactions.transaction_date) = '${frameDbDate(date)}'`
    )

    const items = []
    const rows = result.rows


    for (let i = 0; i < rows.length; i++) {
        let item = rows.item(i)
        item['account'] = await getAccount(item['account_id'])
        delete item['account_id']
        item['category'] = await getCategory(item['category_id'])
        delete item['category_id']
        if (item['from_id']) {
            item['from_transaction'] = await getTransaction(item['from_id'])
            delete item['from_id']
        }
        if (item['to_id']) {
            item['to_transaction'] = await getTransaction(item['to_id'])
            delete item['to_id']
        }
        items.push(item)
    }

    return items
}

export const addTransaction = async (transaction: TransactionInterface) => {
    console.log('Adding transaction entry')

    return await executeQuery(
        `INSERT INTO transactions (name, value, is_income, transaction_date, account_id, category_id) VALUES (
                '${transaction.name}', 
                ${transaction.value}, 
                ${transaction.is_income},
                '${frameDbDateTime(transaction.transaction_date)}',
                ${transaction.account.id},
                ${transaction.category.id}
        )`
    )
}

export const getTransaction = async (id: number): Promise<TransactionInterface> => {
    const result: any = await executeQuery(
        `SELECT * FROM transactions WHERE id=${id}`
    )
    let item = result.rows.item(0)
    item['account'] = await getAccount(item['account_id'])
    delete item['account_id']
    item['category'] = await getCategory(item['category_id'])
    delete item['category_id']

    return item
}

export const deleteTransaction = async (transaction: TransactionInterface) => {
    await executeQuery(
        `DELETE FROM transactions WHERE id=${transaction.id}`
    )
}

export const addTransfer = async (transfer: TransferInterface) => {
    await executeQuery(
        `INSERT INTO transfers (from_id, to_id) VALUES (
            ${transfer.from_transaction.id}, ${transfer.to_transaction.id}
        )`
    )
}

export const getTransfer = async (transaction: TransactionInterface): Promise<TransferInterface | undefined> => {
    const result: any = await executeQuery(
        `SELECT * FROM transfers WHERE from_id = ${transaction.id} or to_id = ${transaction.id}`
    )

    const rows = result.rows

    let item = rows.item(0)

    if (!item) {
        return
    }

    item['from_transaction'] = await getTransaction(item['from_id'])
    delete item['from_id']
    item['to_transaction'] = await getTransaction(item['to_id'])
    delete item['to_id']

    return item
}

export const getTotalExpense = async (account: AccountInterface): Promise<number> => {
    const result: any = await executeQuery(
        `SELECT sum(value) FROM transactions WHERE account_id = ${account.id} AND is_income = 0`
    )

    return sumFromResult(result)
}

export const getTotalIncome = async (account: AccountInterface): Promise<number> => {
    const result: any = await executeQuery(
        `SELECT sum(value) FROM transactions WHERE account_id = ${account.id} AND is_income = 1`
    )

    return sumFromResult(result)
}