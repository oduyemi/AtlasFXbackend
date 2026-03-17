import { Module } from "@nestjs/common";
import { FxService } from "./fx.service";
import { FxController } from './fx.controller';


@Module({
  providers: [FxService],
  exports: [FxService],
  controllers: [FxController]
})
export class FxModule {}