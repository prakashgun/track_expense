import TransactionTypeInterface from "./TransactionTypeInterface"


export default interface TransactionTypeSelectInterface {
    transactionTypes: TransactionTypeInterface[],
    selectedTransactionType: TransactionTypeInterface,
    setSelectedTransactionType: (type: TransactionTypeInterface) => void
}