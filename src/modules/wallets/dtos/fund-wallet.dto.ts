import { IsEnum, IsNumber, Min } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";
import { ApiProperty } from '@nestjs/swagger';



export class FundWalletDto {
  @ApiProperty({ example: 'NGN' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.01)
  amount: number;
}