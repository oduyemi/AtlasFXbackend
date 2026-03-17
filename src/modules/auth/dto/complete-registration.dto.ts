import { IsEmail, IsEnum, IsOptional, IsArray } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";

export class CompleteRegistrationDto {
  @IsEmail()
  email: string;

  @IsEnum(Currency)
  primaryCurrency: Currency;

  @IsOptional()
  @IsArray()
  @IsEnum(Currency, { each: true })
  otherCurrencies?: Currency[];
}