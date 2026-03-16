import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trade } from "./entities/trade.entity";
import { WalletsService } from "../wallets/wallets.service";
import { FxService } from "../fx/fx.service";

@Injectable()
export class TradesService {
    constructor(

        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>,
        private walletService: WalletsService,
        private fxService: FxService
        ) {}

    async executeTrade(
        userId: number,
        from: string,
        to: string,
        amount: number
    ) {
    
        const rate = await this.fxService.getRate(from, to)
        const convertedAmount = amount * rate
        await this.walletService.convertCurrency(
        userId,
        from,
        to,
        amount
        )
        
        const trade = this.tradeRepository.create({
        userId,
        fromCurrency: from,
        toCurrency: to,
        amount,
        convertedAmount,
        rate
        })
        
        return this.tradeRepository.save(trade)
    }
}