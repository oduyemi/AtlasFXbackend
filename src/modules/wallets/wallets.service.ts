import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletBalance } from "./entities/wallet-balance.entity";
import { FxService } from "../fx/fx.service";



@Injectable()
export class WalletsService {

  constructor(

    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    @InjectRepository(WalletBalance)
    private balanceRepository: Repository<WalletBalance>,

    private dataSource: DataSource,

    private fxService: FxService

  ) {}

  async createWallet(userId: number) {

    const wallet = this.walletRepository.create({
     user: { id: userId }
    })
   
    return this.walletRepository.save(wallet)
   }
   
   async createCurrency(walletId: number, currency: string) {
   
    const balance = this.balanceRepository.create({
     wallet: { id: walletId },
     currency,
     balance: 0
    })
   
    return this.balanceRepository.save(balance)
   }

  async fundWallet(userId: number, amount: number) {

    if (amount <= 0)
      throw new BadRequestException("Invalid amount")

    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ["balances"]
    })

    if (!wallet)
      throw new BadRequestException("Wallet not found")

    let balance = wallet.balances.find(b => b.currency === "NGN")

    if (!balance) {
      balance = this.balanceRepository.create({
        wallet,
        currency: "NGN",
        balance: 0
      })
    }

    balance.balance += amount

    await this.balanceRepository.save(balance)

    return balance
  }

  async convertCurrency(
    userId: number,
    from: string,
    to: string,
    amount: number
  ) {

    if (amount <= 0)
      throw new BadRequestException("Invalid amount")

    return this.dataSource.transaction(async manager => {

      const wallet = await manager.findOne(Wallet, {
        where: { user: { id: userId } },
        relations: ["balances"]
      })

      if (!wallet)
        throw new BadRequestException("Wallet not found")

      const fromBalance = wallet.balances.find(b => b.currency === from)

      if (!fromBalance || fromBalance.balance < amount)
        throw new BadRequestException("Insufficient balance")

      const rate = await this.fxService.getRate(from, to)

      const convertedAmount = amount * rate

      fromBalance.balance -= amount

      let toBalance = wallet.balances.find(b => b.currency === to)

      if (!toBalance) {
        toBalance = manager.create(WalletBalance, {
          wallet,
          currency: to,
          balance: 0
        })
      }

      toBalance.balance += convertedAmount

      await manager.save(fromBalance)
      await manager.save(toBalance)

      return {
        rate,
        amount,
        convertedAmount
      }

    })
  }
}