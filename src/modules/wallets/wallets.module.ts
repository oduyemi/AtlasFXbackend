import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletBalance } from "./entities/wallet-balance.entity";
import { WalletsService } from "./wallets.service";
import { WalletsController } from "./wallets.controller";
import { FxModule } from "../fx/fx.module";
import { User } from "../users/entities/user.entity";
import { TradesModule } from "../trades/trades.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      WalletBalance,
      User
    ]),
    FxModule,
    forwardRef(() => TradesModule) 
  ],
  providers: [WalletsService],
  controllers: [WalletsController],
  exports: [WalletsService]
})
export class WalletsModule {}