import AccountInterface from "./AccountInterface"
import { TransactionTypeInterface } from "./TransactionInterface";

export default interface AccountSelectInterface {
    accounts: AccountInterface[],
    selectedAccount: AccountInterface,
    setSelectedAccount: (account: AccountInterface) => void,
    selectedType: TransactionTypeInterface,
    isFromAccount: boolean
}