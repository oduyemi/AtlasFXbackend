import {
    Injectable,
    BadRequestException,
    NotFoundException
  } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { Repository, DataSource } from "typeorm";
  import { Trade } from "./entities/trade.entity";
  import { Wallet } from "../wallets/entities/wallet.entity";
  import { WalletBalance } from "../wallets/entities/wallet-balance.entity";
  import { FxService } from "../fx/fx.service";
  import { Currency } from "src/common/enums/currency.enum";
  import { Transaction, TransactionStatus, TransactionType } from "../transactions/entities/transaction.entity";
  import Decimal from "decimal.js";
  
  
  @Injectable()
  export class TradesService {
    constructor(
      @InjectRepository(Trade)
      private tradeRepository: Repository<Trade>,
  
      @InjectRepository(Transaction)
      private transactionRepository: Repository<Transaction>,
  
      private dataSource: DataSource,
      private fxService: FxService
    ) {}
  
    async executeTrade(
      userId: number,
      from: Currency,
      to: Currency,
      amount: number
    ) {
      if (from !== Currency.NGN) {
        throw new BadRequestException("Only NGN can be used as base currency");
      }

      if (to === Currency.NGN) {
        throw new BadRequestException("Cannot trade NGN to NGN");
      }
  
      if (amount <= 0) {
        throw new BadRequestException("Invalid amount");
      }
  
      return this.dataSource.transaction("SERIALIZABLE", async (manager) => {  
        const wallet = await manager.findOne(Wallet, {
          where: { user: { id: userId } },
          lock: { mode: "pessimistic_write" }
        });
  
        if (!wallet) {
          throw new NotFoundException("Wallet not found");
        }

        const balances = await manager.find(WalletBalance, {
          where: { wallet: { id: wallet.id } },
          lock: { mode: "pessimistic_write" }
        });
  
        const fromBalance = balances.find(
          (b) => b.currency === from
        );
        
        if (!fromBalance || Number(fromBalance.balance) < amount) {
          throw new BadRequestException("Insufficient balance");
        }
        
        const rate = await this.fxService.getRate(from, to);
        
        const amountDecimal = new Decimal(amount);
        const rateDecimal = new Decimal(rate);
        
        const convertedAmount = amountDecimal.mul(rateDecimal);
        
        fromBalance.balance = new Decimal(fromBalance.balance)
          .minus(amountDecimal)
          .toNumber();
        
        let toBalance = balances.find(
          (b) => b.currency === to
        );
        
        if (!toBalance) {
          toBalance = manager.create(WalletBalance, {
            wallet,
            currency: to,
            balance: 0,
          });
        }
        
        toBalance.balance = new Decimal(toBalance.balance || 0)
          .plus(convertedAmount)
          .toNumber();
        
        await manager.save(fromBalance);
        await manager.save(toBalance);
  
        await manager.save(fromBalance);
        await manager.save(toBalance);  
        const trade = manager.create(Trade, {
            user: { id: userId },  
            fromCurrency: from,
            toCurrency: to,
            amount,
            convertedAmount: convertedAmount.toNumber(),
            rate,
        });
  
        await manager.save(trade);
        const transaction = manager.create(Transaction, {
            user: { id: userId },
            type: TransactionType.TRADE,
            fromCurrency: from,
            toCurrency: to,
            amount: amount.toString(),
            convertedAmount: convertedAmount.toString(),
            rateUsed: rate.toString(),
            status: TransactionStatus.SUCCESS,
          });
            
        await manager.save(transaction);
  
        return {
          tradeId: trade.id,
          from,
          to,
          amount,
          convertedAmount: convertedAmount.toNumber(),
          rate,
          status: "SUCCESS"
        };
      });
    }
  }