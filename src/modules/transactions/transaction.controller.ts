import {
    Controller,
    Get,
    UseGuards
  } from "@nestjs/common";
  import { TransactionsService } from "./transactions.service";
  import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
  import { CurrentUser } from "src/common/decorators/current-user.decorator";
  
  @UseGuards(JwtAuthGuard)
  @Controller("transactions")
  export class TransactionsController {
    constructor(
      private readonly transactionsService: TransactionsService
    ) {}
  
    
    @Get()
    async getUserTransactions(
        @CurrentUser() user
        ) {
      return this.transactionsService.getTransactions(user.userId);
    }
  }