export default interface AccountInterface {
    id: string,
    name: string,
    initial_balance: number,
    total_expense?: number,
    total_income?: number,
    created_at?: Date
}