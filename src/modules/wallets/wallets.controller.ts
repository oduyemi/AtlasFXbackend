import { UseGuards, Controller,Get, Post, Body, Req } from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Currency } from "src/common/enums/currency.enum";
import { ConvertCurrencyDto } from "./dtos/convert-currency.dto";
import { TradesService } from "../trades/trades.service";
import { ExecuteTradeDto } from "../trades/dtos/execute-trade.dto";


@UseGuards(JwtAuthGuard)
@Controller("wallet")
export class WalletsController {
  constructor(
    private walletService: WalletsService,
    private tradeService: TradesService
  ) {}
  @Get()
  async getWallet(@CurrentUser() user) {
    return this.walletService.getWallet(user.userId);
  }

  @Post("fund")
  async fundWallet(
    @CurrentUser() user,
    @Body() body: { currency: Currency; amount: number }
  ) {
    return this.walletService.fundWallet(
      user.userId,
      body.currency,
      body.amount
    );
  }

  
  @Post("convert")
  convert(
    @Req() req,
    @Body() dto: ConvertCurrencyDto
  ) {
    return this.walletService.convertCurrency(
      req.user.id,
      Currency.NGN,   
      dto.to,
      dto.amount
    );
  }
  
  @Post("trade")
  executeTrade(
    @CurrentUser() user,
    @Body() dto: ExecuteTradeDto
  ) {
    return this.tradeService.executeTrade(
      user.userId,
      Currency.NGN,    
      dto.toCurrency, 
      dto.amount
    );
  }
}