import { IsEmail, IsString, Length, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  @Matches(/^\d+$/, { message: "OTP must contain only numbers" })
  otp: string;
}