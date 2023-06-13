import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(), //Habilitar el Cors
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,    // transforma los parametros automaticamente segun el Dto
      transformOptions:{
        enableImplicitConversion: true,
      }
    })
  );
  await app.listen(3000);
}
bootstrap();
