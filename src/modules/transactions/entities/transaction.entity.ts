import { User } from "src/modules/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

export enum TransactionType {
  FUND = "FUND",
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
  TRADE = "TRADE",
  CONVERT = "CONVERT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ nullable: true })
  fromCurrency: string;

  @Column({ nullable: true })
  toCurrency: string;

  @Column("decimal", { precision: 18, scale: 6 })
  amount: string;

  @Column("decimal", { precision: 18, scale: 6, nullable: true })
  convertedAmount: string;

  @Column("decimal", { precision: 18, scale: 6, nullable: true })
  rateUsed: string;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}