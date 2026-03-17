import {
    Controller,
    Get,
    UseGuards
  } from "@nestjs/common";
  import { TransactionsService } from "./transactions.service";
  import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
  import { CurrentUser } from "src/common/decorators/current-user.decorator";
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


  @ApiTags("transactions")
  @UseGuards(JwtAuthGuard)
  @Controller("transactions")
  export class TransactionsController {
    constructor(
      private readonly transactionsService: TransactionsService
    ) {}
  
    
    @Get()
    @ApiOperation({ summary: 'View user transactions' })
    @ApiResponse({ status: 201, description: 'Transaction history' })
    async getUserTransactions(
        @CurrentUser() user
        ) {
      return this.transactionsService.getTransactions(user.userId);
    }
  }