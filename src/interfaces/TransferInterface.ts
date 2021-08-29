import TransactionInterface from "./TransactionInterface";

export default interface TransferInterface {
    id?: number,
    from_transaction: TransactionInterface,
    to_transaction: TransactionInterface,
    created_at?: string
}