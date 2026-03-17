import { Currency } from "src/common/enums/currency.enum";
import { IsEnum, IsNumber, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';



export class ConvertCurrencyDto {
  @ApiProperty({ example: 'NGN' })
  @IsEnum(Currency)
  from: Currency;

  @ApiProperty({ example: 'USD' })
  @IsEnum(Currency)
  to: Currency;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  amount: number;
}