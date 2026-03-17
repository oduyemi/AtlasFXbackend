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


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule,
    WalletsModule,
    MailModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "1d" }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}