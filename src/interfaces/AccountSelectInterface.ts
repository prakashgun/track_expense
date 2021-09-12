import AccountInterface from "./AccountInterface"
import TransactionTypeInterface from "./TransactionTypeInterface"


export default interface AccountSelectInterface {
    accounts: AccountInterface[],
    selectedAccount: AccountInterface,
    setSelectedAccount: (account: AccountInterface) => void,
    selectedTransactionType: TransactionTypeInterface,
    isFromAccount: boolean
}