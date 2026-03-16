import { Controller, Post, Body } from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";



@Controller("wallet")
export class WalletsController {
  constructor(private walletService: WalletsService) {}

  @Post("fund")
  async fundWallet(
    @CurrentUser() user, 
    @Body() body: { amount: number } 
  ) {
    return this.walletService.fundWallet(user.userId, body.amount);
  }

  
  @Post("convert")
  async convert(
    @CurrentUser() user,
    @Body() body: { from: string; to: string; amount: number }
  ) {
    return this.walletService.convertCurrency(
      user.userId,
      body.from,
      body.to,
      body.amount
    );
  }
}