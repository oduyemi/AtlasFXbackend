import { IsEmail, IsEnum, IsOptional, IsArray } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";
import { ApiProperty } from '@nestjs/swagger';


export class CompleteRegistrationDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NGN' })
  @IsEnum(Currency)
  primaryCurrency: Currency;

  @ApiProperty({ example: ['USD', 'EUR'] })
  @IsOptional()
  @IsArray()
  @IsEnum(Currency, { each: true })
  otherCurrencies?: Currency[];
}