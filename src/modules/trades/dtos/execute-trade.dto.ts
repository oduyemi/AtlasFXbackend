import { IsEnum, IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "src/common/enums/currency.enum";



export class ExecuteTradeDto {
  @ApiProperty({ example: 'NGN' })
  @IsEnum(Currency)
  toCurrency: Currency;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsPositive()
  amount: number;
}