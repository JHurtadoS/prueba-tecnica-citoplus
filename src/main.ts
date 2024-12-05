import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Dominios permitidos
    credentials: true, // Habilitar envío de cookies
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // Habilita la transformación de los tipos
  //     whitelist: true, // Elimina propiedades no definidas en los DTOs
  //     forbidNonWhitelisted: true, // Rechaza solicitudes con propiedades adicionales
  //   }),
  // );

  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe());

}
bootstrap();
