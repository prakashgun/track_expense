import AccountInterface from "./AccountInterface"
import CategoryInterface from "./CategoryInterface"


export default interface TransactionInterface {
    id: string,
    name: string,
    value: number,
    is_income: boolean,
    account: AccountInterface,
    category: CategoryInterface,
    transaction_date: Date,
    from_transaction?: TransactionInterface,
    to_transaction?: TransactionInterface,
    created_at?: Date
}