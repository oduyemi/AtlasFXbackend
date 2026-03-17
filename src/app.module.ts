import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { WalletsModule } from "./modules/wallets/wallets.module";
import { TradesModule } from "./modules/trades/trades.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { FxModule } from "./modules/fx/fx.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // DATABASE CONNECTION
    TypeOrmModule.forRoot({
      type: "postgres", 
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),

    AuthModule,
    UsersModule,
    WalletsModule,
    TradesModule,
    TransactionsModule,
    FxModule
  ],
  controllers: [AppController],
})
export class AppModule {}