import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trade } from "./entities/trade.entity";
import { TradesService } from "./trades.service";
import { TradesController } from "./trades.controller";
import { WalletsModule } from "../wallets/wallets.module";
import { FxModule } from "../fx/fx.module";



@Module({
 imports: [
  TypeOrmModule.forFeature([Trade]),
  WalletsModule,
  FxModule
 ],
 providers: [TradesService],
 controllers: [TradesController]
})

export class TradesModule {}