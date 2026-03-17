import { Currency } from "src/common/enums/currency.enum";
import { IsEnum, IsNumber, Min } from "class-validator";

export class ConvertCurrencyDto {
  @IsEnum(Currency)
  from: Currency;

  @IsEnum(Currency)
  to: Currency;

  @IsNumber()
  @Min(1)
  amount: number;
}