import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { databaseConfig } from "./config/database.config"

import { WalletsModule } from "./modules/wallets/wallets.module"
import { FxModule } from "./modules/fx/fx.module"

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    WalletsModule,
    FxModule
  ]
})
export class AppModule {}