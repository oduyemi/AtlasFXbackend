import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trade } from "./entities/trade.entity";
import { TradesService } from "./trades.service";
import { WalletsModule } from "../wallets/wallets.module";
import { FxModule } from "../fx/fx.module";
import { Transaction } from "../transactions/entities/transaction.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade, Transaction]),
    forwardRef(() => WalletsModule),
    FxModule
  ],
  providers: [TradesService],
  exports: [TradesService],
})
export class TradesModule {}