import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv"
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  global.appRoot = __dirname;
  app.enableCors({
    origin: process.env.DOMAIN_FRONT, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
