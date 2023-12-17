import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createApp } from './helpers/createApp';
import { KromLogger } from './logger/logger.service';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const nestFactory =
    await NestFactory.create<NestExpressApplication>(AppModule);

  const app = createApp(nestFactory);

  app.useLogger(app.get(KromLogger));

  await app.listen(PORT, () => {
    console.log('server started on port = ' + PORT);
  });
}

bootstrap();
