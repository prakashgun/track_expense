import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser"
import { Expense } from "./Expense"

@Entity()
export class Account{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        length: 50
    })
    name: string

    @Column({
        type: "float"
    })
    balance: number

    @OneToMany(type=>Expense, expense => expense.account)
    expenses: Expense[]
}
