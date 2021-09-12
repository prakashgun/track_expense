import TransactionTypeInterface from "./TransactionTypeInterface";


export default interface TransactionTypeSelectInterface {
    transactionTypes: TransactionTypeInterface[],
    selectedType: TransactionTypeInterface,
    setSelectedType: (type: TransactionTypeInterface) => void
}