import { getRepository } from 'typeorm/browser'
import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'
import dbConnect from './dbConnect'


export const createDefaultAccounts = async () => {
    await dbConnect()
    const accountRepository = await getRepository(Account)
    const accountsCount = await accountRepository.count()
    console.log('Accounts count')
    console.log(accountsCount)

    if (accountsCount === 0) {
        const account1 = new Account()
        account1.name = 'Cash'
        account1.balance = 0
        await accountRepository.save(account1)
        console.log('Default accounts saved')
    }
}

export const createDefaultCategories = async () => {
    await dbConnect()
    const categoryRepository = await getRepository(Category)

    const categoriesCount = await categoryRepository.count()

    if (categoriesCount === 0) {

        const defaultCategories = [
            {
                name: 'Food',
                icon_name: 'fastfood',
                icon_type: 'material-icons'
            },
            {
                name: 'Clothing',
                icon_name: 'tshirt',
                icon_type: 'font-awesome-5'
            },
            {
                name: 'Transportation',
                icon_name: 'car',
                icon_type: 'font-awesome'
            },
            {
                name: 'Education',
                icon_name: 'graduation-cap',
                icon_type: 'font-awesome'
            },
            {
                name: 'Entertainment',
                icon_name: 'movie',
                icon_type: 'material-icons'
            },
            {
                name: 'Social',
                icon_name: 'group',
                icon_type: 'font-awesome'
            },
            {
                name: 'Investment',
                icon_name: 'bar-graph',
                icon_type: 'entypo'
            },
            {
                name: 'Health',
                icon_name: 'fitness-center',
                icon_type: 'material-icons'
            },
            {
                name: 'Medical',
                icon_name: 'medical-services',
                icon_type: 'material-icons'
            },
            {
                name: 'Others',
                icon_name: 'miscellaneous-services',
                icon_type: 'material-icons'
            }
        ]

        await categoryRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values(defaultCategories)
            .execute()

        console.log('Default categories saved')
    }
}

export const getAccounts = async () => {
    await dbConnect()
    const accountRepository = getRepository(Account)
    return await accountRepository.find({ take: 10000 })
}

export const getCategories = async () => {
    await dbConnect()
    const categoryRepository = getRepository(Category)
    return await categoryRepository.find({ take: 10000 })
}

export const getTransactions = async () => {
    await dbConnect()
    const transactionRepository = getRepository(Transaction)
    return await transactionRepository.find({ take: 10000 })
}

export const getAccount = async (id: number) => {
    await dbConnect()
    const accountRepository = getRepository(Account)
    return await accountRepository.findOne(id)
}

export const getCategory = async (id: number) => {
    await dbConnect()
    const categoryRepository = getRepository(Category)
    return await categoryRepository.findOne(id)
}

export const getTransaction = async (id: number) => {
    await dbConnect()
    const accountRepository = getRepository(Transaction)
    return await accountRepository.findOne(id)
}