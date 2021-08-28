import db from "./db"
import { defaultCategories } from "./defaultData"

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

export const createTables = async () => {
    // await executeQuery('DROP TABLE IF EXISTS accounts')
    // await executeQuery('DROP TABLE IF EXISTS categories')
    // await executeQuery('DROP TABLE IF EXISTS transactions')

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS accounts(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    balance REAL NOT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
    )

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS categories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            icon_name TEXT NOT NULL,
            icon_type TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
    )

    await executeQuery(
        `CREATE TABLE IF NOT EXISTS transactions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            value REAL NOT NULL,
            type TEXT NOT NULL,
            account_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(account_id) REFERENCES accounts(id),
            FOREIGN KEY(category_id) REFERENCES categories(id)
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
            `INSERT INTO accounts (name, balance) VALUES ('Cash', 0)`
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

export const getCategories = async () => {
    const categoriesResult: any = await executeQuery(
        `SELECT * FROM categories`
    )

    return itemsFromResult(categoriesResult)
}