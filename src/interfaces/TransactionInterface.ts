import AccountInterface from "./AccountInterface"
import CategoryInterface from "./CategoryInterface"

export const types: TransactionTypeInterface[] = [
    {
        name: 'Expense',
        icon_name: 'money-off',
        icon_type: 'material-icons'
    },    
    {
        name: 'Income',
        icon_name: 'attach-money',
        icon_type: 'material-icons'
    },    
    {
        name: 'Transfer',
        icon_name: 'bank-transfer',
        icon_type: 'material-community'
    }
]

export interface TransactionTypeInterface {
    name: string,
    icon_name: string,
    icon_type: string
}

export default interface TransactionInterface {
    id?: number,
    name: string,
    value: number,
    is_income: boolean,
    account: AccountInterface,
    category: CategoryInterface,
    created_at?: string
}