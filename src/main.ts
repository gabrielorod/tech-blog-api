import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  console.log('MEU SEGREDO NO ENV:', process.env.JWT_SECRET);
  process.exit(1);
});
