import { IsEnum, IsNumber, Min } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";


export class FundWalletDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  @Min(0.01)
  amount: number;
}