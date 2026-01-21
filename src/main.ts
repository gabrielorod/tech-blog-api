import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
});
