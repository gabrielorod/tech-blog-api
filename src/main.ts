import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();

  const swaggerPath = path.join(process.cwd(), 'src/swagger.json');
  const swaggerData = JSON.parse(
    fs.readFileSync(swaggerPath, 'utf8'),
  ) as unknown as OpenAPIObject;

  SwaggerModule.setup('api/docs', app, swaggerData);

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
});
