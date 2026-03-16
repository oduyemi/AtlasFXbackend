import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./entities/wallet.entity"
import { WalletBalance } from "./entities/wallet-balance.entity"
import { WalletsService } from "./wallets.service"
import { WalletsController } from "./wallets.controller"
import { FxModule } from "../fx/fx.module"



@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      WalletBalance
    ]),
    FxModule
  ],
  providers: [WalletsService],
  controllers: [WalletsController],
  exports: [WalletsService]
})
export class WalletsModule {}