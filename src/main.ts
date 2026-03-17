import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filters";



async function bootstrap() {

 const app = await NestFactory.create(AppModule);

 const config = new DocumentBuilder()
  .setTitle("AtlasFX API")
  .setDescription("FX & Trading API")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("docs", app, document);

 app.useGlobalPipes(
  new ValidationPipe({
   whitelist: true,
   forbidNonWhitelisted: true,
   transform: true
  })
 );
 

 app.useGlobalFilters(new HttpExceptionFilter());
 await app.listen(process.env.PORT ?? 3000);

 console.log(`Server running on port ${process.env.PORT ?? 3000}`);
}

bootstrap();