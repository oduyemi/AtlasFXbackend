import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {

  @Get()
  getIndex() {
    return {
      message: "Welcome to AtlasFX API"
    };
  }

}