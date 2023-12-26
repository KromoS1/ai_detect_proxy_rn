import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createApp } from './helpers/app/createApp';
import { KromLogger } from './helpers/logger/logger.service';
import { createSwagger } from './helpers/app/createSwagger';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const nestFactory =
    await NestFactory.create<NestExpressApplication>(AppModule);

  nestFactory.useStaticAssets(join(__dirname, '..', 'assets', 'template'));
  nestFactory.useStaticAssets(join(__dirname, '..', 'assets', 'docs'));

  const app = createApp(nestFactory);

  app.useLogger(app.get(KromLogger));
  app.setGlobalPrefix('api');

  createSwagger(app);

  await app.listen(PORT, () => {
    console.log('server started on port = ' + PORT);
  });
}

bootstrap();
