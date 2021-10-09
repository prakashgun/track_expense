import TransactionInterface from "./TransactionInterface";

export default interface TransferInterface {
    id: string,
    from_transaction: TransactionInterface,
    to_transaction: TransactionInterface,
    created_at?: Date
}