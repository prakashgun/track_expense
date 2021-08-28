import AccountInterface from "./AccountInterface";
import CategoryInterface from "./CategoryInterface";

export enum TransactionTypes {
    expense = 'expense',
    income = 'income',
    transfer = 'transfer'
}

export default interface TransactionInterface {
    id?: number,
    name: string,
    value: number,
    type: TransactionTypes,
    account: AccountInterface,
    category: CategoryInterface,
    created_at?: string
}