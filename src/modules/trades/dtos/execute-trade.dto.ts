import { IsEnum, IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "src/common/enums/currency.enum";



export class ExecuteTradeDto {
  @ApiProperty()
  @IsEnum(Currency)
  toCurrency: Currency;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}