import { getRepository } from 'typeorm/browser'
import { Account } from '../entities/Account'
import dbConnect from './dbConnect'

export default async () => {
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