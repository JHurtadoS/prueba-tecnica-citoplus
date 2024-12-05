import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    allowedHeaders: 'Content-Type,Authorization',
  });



  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe());

}
bootstrap();
