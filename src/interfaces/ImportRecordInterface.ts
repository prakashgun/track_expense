export default interface ImportRecordInterface {
    date: Date,
    amount: number,
    category: string,
    expense_or_transfer_out_account: string,
    income_or_transfer_in_account: string,
    note: string,
    system_generated_id: string
}