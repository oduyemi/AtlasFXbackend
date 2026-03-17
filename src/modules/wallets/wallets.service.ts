import { Injectable, Inject, forwardRef, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletBalance } from "./entities/wallet-balance.entity";
import { FxService } from "../fx/fx.service";
import { User } from "../users/entities/user.entity";
import { Currency } from "src/common/enums/currency.enum";
import Decimal from "decimal.js";
import { TradesService } from "../trades/trades.service";

@Injectable()
export class WalletsService {

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(WalletBalance)
    private balanceRepository: Repository<WalletBalance>,

    @Inject(forwardRef(() => TradesService))
  private tradesService: TradesService,

    private dataSource: DataSource,

    private fxService: FxService

  ) {}

  async createWallet(userId: number) {

    const wallet = this.walletRepository.create({
     user: { id: userId }
    })
   
    return this.walletRepository.save(wallet)
   }
   
   async createCurrency(walletId: number, currency: Currency) {
    const wallet = await this.walletRepository.findOneBy({ id: walletId });
    if (!wallet) throw new NotFoundException("Wallet not found");
    const balance = this.balanceRepository.create({
      wallet,
      currency,
      balance: 0,
    });

    return this.balanceRepository.save(balance)
   }

   async fundWallet(
    userId: number,
    currency: Currency,
    amount: number
  ) {
    if (amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }
  
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ["balances"],
    });
  
    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }
  
    let balance = wallet.balances.find(b => b.currency === currency);
  
    if (!balance) {
      balance = this.balanceRepository.create({
        wallet,
        currency,
        balance: 0,
      });
    }
  
    balance.balance = new Decimal(balance.balance)
  .plus(amount)
  .toNumber();
  
    await this.balanceRepository.save(balance);
  
    return balance;
  }

  async getWallet(userId: number) {
    const existingWallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ["balances"],
    });
  
    if (existingWallet) {
      return {
        walletId: existingWallet.id,
        balances: existingWallet.balances.map((b) => ({
          currency: b.currency,
          balance: Number(b.balance),
        })),
      };
    }
  
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    const wallet = await this.walletRepository.save(
      this.walletRepository.create({ user })
    );
  
    const defaultCurrencies = Object.values(Currency);
    const balances = defaultCurrencies.map((currency) =>
      this.balanceRepository.create({
        wallet, 
        currency,
        balance: 0,
      })
    );
  
    await this.balanceRepository.save(balances);
  
    wallet.balances = balances;
  
    return {
      walletId: wallet.id,
      balances: wallet.balances.map((b) => ({
        currency: b.currency,
        balance: Number(b.balance),
      })),
    };
  }

  async convertCurrency(
    userId: number,
    from: Currency,
    to: Currency,
    amount: number
  ) {
    if (amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }
  
    if (from === to) {
      throw new BadRequestException("Cannot convert same currency");
    }
  
    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { user: { id: userId } },
        relations: ["balances"],
      });
  
      if (!wallet) {
        throw new NotFoundException("Wallet not found");
      }
  
      const fromBalance = wallet.balances.find(
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
      
      let toBalance = wallet.balances.find(
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
  
      return {
        from,
        to,
        rate,
        amount,
        convertedAmount,
      };
    });
  }

  async debit(
    userId: number,
    currency: Currency,
    amount: number
  ) {
    if (amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }
  
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ["balances"],
    });
  
    if (!wallet) throw new NotFoundException("Wallet not found");
  
    const balance = wallet.balances.find(b => b.currency === currency);
  
    if (!balance || Number(balance.balance) < amount) {
      throw new BadRequestException("Insufficient balance");
    }
  
    balance.balance = new Decimal(balance.balance)
      .minus(amount)
      .toNumber();
  
    return this.balanceRepository.save(balance);
  }

  async credit(
    userId: number,
    currency: Currency,
    amount: number
  ) {
    if (amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }
  
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ["balances"],
    });
  
    if (!wallet) throw new NotFoundException("Wallet not found");
  
    let balance = wallet.balances.find(b => b.currency === currency);
  
    if (!balance) {
      balance = this.balanceRepository.create({
        wallet,
        currency,
        balance: 0,
      });
    }
  
    balance.balance = new Decimal(balance.balance)
      .plus(amount)
      .toNumber();
  
    return this.balanceRepository.save(balance);
  }
}