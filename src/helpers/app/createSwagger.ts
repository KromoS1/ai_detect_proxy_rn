import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const createSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('AI Dectection')
    .setDescription('Документация REST API для работы с модулями AI ')
    .setVersion('1.0.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api/docs', app, document);
};
