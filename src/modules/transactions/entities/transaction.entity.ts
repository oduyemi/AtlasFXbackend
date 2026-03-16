import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
   } from "typeorm";


   
@Entity()
export class Transaction {
   
    @PrimaryGeneratedColumn()
    id: number
   
    @Column()
    userId: number
   
    @Column()
    type: string
   
    @Column()
    fromCurrency: string
   
    @Column()
    toCurrency: string
   
    @Column("decimal",{precision:18,scale:6})
    amount: number
   
    @Column("decimal",{precision:18,scale:6,nullable:true})
    convertedAmount: number
   
    @Column("decimal",{precision:18,scale:6,nullable:true})
    rateUsed: number
   
    @Column()
    status: string
   
    @CreateDateColumn()
    createdAt: Date
}