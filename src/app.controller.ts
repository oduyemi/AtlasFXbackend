import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags("AtlasFX")
@Controller()
export class AppController {

  @Get()
  @ApiOperation({ summary: 'Get Index' })
  @ApiResponse({ status: 201, description: 'App welcome message' })
  getIndex() {
    return {
      message: "Welcome to AtlasFX API"
    };
  }

}