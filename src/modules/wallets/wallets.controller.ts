import { Controller, Post, Body } from "@nestjs/common";
import { WalletsService } from "./wallets.service";


@Controller("wallet")
export class WalletsController {
  constructor(private walletService: WalletsService) {}
  @Post("fund")
  fundWallet(@Body() body) {
    return this.walletService.fundWallet(
      body.userId,
      body.amount
    )
  }

  @Post("convert")
  convert(@Body() body) {
    return this.walletService.convertCurrency(
      body.userId,
      body.from,
      body.to,
      body.amount
    )
  }
}