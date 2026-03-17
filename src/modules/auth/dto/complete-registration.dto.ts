import { IsEmail, IsString, IsOptional, IsArray, IsIn } from "class-validator";

export class CompleteRegistrationDto {

  @IsEmail()
  email: string;

  @IsString()
  @IsIn(["NGN","USD","GBP","EUR"])
  primaryCurrency: string;

  @IsOptional()
  @IsArray()
  otherCurrencies?: string[];
}