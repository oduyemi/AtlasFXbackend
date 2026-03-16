import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Wallet } from "@/wallets/entities/wallet.entity"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: false })
  isVerified: boolean

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet
}