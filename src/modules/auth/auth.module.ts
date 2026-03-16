import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "../users/entities/user.entity";
import { Otp } from "./entities/otp.entity";
import { WalletsModule } from "../wallets/wallets.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
 imports: [
  TypeOrmModule.forFeature([User, Otp]),
  WalletsModule,
  JwtModule.register({
   secret: "secretKey",
   signOptions: { expiresIn: "1d" }
  })
 ],
 providers: [AuthService],
 controllers: [AuthController]
})
export class AuthModule {}