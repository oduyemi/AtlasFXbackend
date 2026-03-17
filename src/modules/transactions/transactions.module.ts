import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionsController } from "./transaction.controller";
import { TransactionsService } from "./transactions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService],
  controllers: [TransactionsController], 
  exports: [TransactionsService],
})
export class TransactionsModule {}