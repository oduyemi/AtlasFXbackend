import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "../users/entities/user.entity";
import { Otp } from "./entities/otp.entity";
import { WalletsModule } from "../wallets/wallets.module";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../mail/mail.module"; 
import { JwtStrategy } from "./jwt.strategy"; 
import { ConfigService } from "@nestjs/config";



@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    WalletsModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    AuthService, 
    JwtStrategy,
  ],
  controllers: [AuthController]
})
export class AuthModule {}