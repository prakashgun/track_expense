export default interface AccountInterface {
    id?: number,
    name: string,
    initial_balance: number,
    total_expense?: number,
    total_income?: number,
    created_at?: Date
}