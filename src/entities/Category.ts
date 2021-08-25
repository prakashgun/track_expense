import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser"
import { Transaction } from "./Transaction"

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        length: 100
    })
    name: string

    @Column({
        nullable: false,
        length: 100
    })
    icon_name: string

    @Column({
        nullable: false,
        length: 100
    })
    icon_type: string

    @OneToMany(type=>Transaction, transaction => transaction.category)
    transactions: Transaction[]
}
