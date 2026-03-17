import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Transaction, TransactionType, TransactionStatus } from "./entities/transaction.entity";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async logTransaction(data: {
    userId: number;
    type: TransactionType;
    fromCurrency?: string;
    toCurrency?: string;
    amount: string;
    convertedAmount?: string;
    rateUsed?: string;
    status?: TransactionStatus;
  }) {
    const transaction = this.transactionRepository.create({
      user: { id: data.userId },
      type: data.type,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      amount: data.amount,
      convertedAmount: data.convertedAmount,
      rateUsed: data.rateUsed,
      status: data.status || TransactionStatus.PENDING,
    });
  
    return this.transactionRepository.save(transaction);
  }

  async getTransactions(userId: number) {
    return this.transactionRepository.find({
      where: {
        user: { id: userId } as User,
      },
      order: { createdAt: "DESC" },
    });
  }
}