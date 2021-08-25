import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser"
import { Transaction } from "./Transaction"

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

    @OneToMany(type=>Transaction, transaction => transaction.account)
    transactions: Transaction[]
}
