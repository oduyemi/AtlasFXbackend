import { Controller, Post, Body } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";


@Controller("trades")
export class TradesController {
    constructor(private tradesService: TradesService) {}

    @Post()
    executeTrade(
      @CurrentUser() user,
      @Body() body
    ) {
    
      return this.tradesService.executeTrade(
        user.id,
        body.fromCurrency,
        body.toCurrency,
        body.amount
      )
    }
}
