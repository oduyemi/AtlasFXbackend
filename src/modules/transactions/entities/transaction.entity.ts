import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

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

  @Column("decimal")
  amount: number

  @Column("decimal", { nullable: true })
  convertedAmount: number

  @Column("decimal", { nullable: true })
  rateUsed: number

  @Column()
  status: string

  @CreateDateColumn()
  createdAt: Date
}