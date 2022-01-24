import TransactionInterface from "./TransactionInterface"

export default interface TransactionItemInterface {
    transaction: TransactionInterface,
    onPress: () => void
}