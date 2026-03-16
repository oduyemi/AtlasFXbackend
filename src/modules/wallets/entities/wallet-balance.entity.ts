import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Wallet } from "./wallet.entity";
import { Unique } from "typeorm";



@Entity()
@Unique(["wallet","currency"])
export class WalletBalance {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Wallet, wallet => wallet.balances)
  wallet: Wallet

  @Column()
  currency: string

  @Column("decimal", {
    precision: 18,
    scale: 6,
    default: 0
  })
  balance: number
}