import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { WalletBalance } from "./wallet-balance.entity"

@Entity()
export class Wallet {

  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => WalletBalance, balance => balance.wallet)
  balances: WalletBalance[]
}