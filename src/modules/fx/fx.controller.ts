import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { FxService } from "./fx.service";
import { Currency } from "src/common/enums/currency.enum";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('fx')
@Controller("fx")
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get("rates")
  @ApiOperation({ summary: 'Retrieve current FX rates for supported currency pair' })
  @ApiResponse({ status: 201, description: 'Base, rates, timestamp' })
  async getRates(@Query("to") to?: string) {
    if (!to) {
      throw new BadRequestException("Query param 'to' is required");
    }

    const toCurrencies = to.split(",").map((c) => c.trim().toUpperCase());

    // Optional: validate currencies against enum
    const invalid = toCurrencies.filter(
      (c) => !Object.values(Currency).includes(c as Currency)
    );

    if (invalid.length > 0) {
      throw new BadRequestException(
        `Invalid currencies: ${invalid.join(", ")}`
      );
    }

    const from = Currency.NGN;

    const rates = await Promise.all(
      toCurrencies.map(async (currency) => {
        const rate = await this.fxService.getRate(from, currency);
        return {
          from,
          to: currency,
          rate,
        };
      })
    );

    return {
      base: from,
      rates,
      timestamp: new Date(),
    };
  }
}