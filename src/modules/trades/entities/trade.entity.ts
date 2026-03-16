import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
   } from "typeorm";
   
    @Entity()
   export class Trade {
        @PrimaryGeneratedColumn()
        id: number
       
        @Column()
        userId: number
       
        @Column()
        fromCurrency: string
       
        @Column()
        toCurrency: string
       
        @Column("decimal",{precision:18,scale:6})
        amount: number
       
        @Column("decimal",{precision:18,scale:6})
        convertedAmount: number
       
        @Column("decimal",{precision:18,scale:6})
        rate: number
       
        @CreateDateColumn()
        createdAt: Date
    }