import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from 'src/helpers/exception/http.exception';

export const createApp = (app: INestApplication): INestApplication => {
  const exceptionFactoryFunc = (errors) => {
    const errorsForResponse = [];

    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);

      constraintsKeys.forEach((ckey) => {
        errorsForResponse.push({
          message: e.constraints[ckey],
          fields: e.property,
        });
      });
    });

    throw new BadRequestException(errorsForResponse);
  };

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app.enableCors({
  //   origin: [
  //     '*',
  //     'exp+fapplication://expo-development-client/?url=http%3A%2F%2F192.168.100.41%3A8081',
  //   ],
  //   credentials: true,
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactoryFunc,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  return app;
};
