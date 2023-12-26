import * as process from 'process';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';

describe('Files tests ', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // jest.resetModules()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        validateCustomDecorators: true,
        validationError: { target: false },
      }),
    );
    await app.init();
  });

  test('Some test name', async () => {
    // const test = await app.get(Sequelize).query(`select count(*) from public.user`, {plain: true})
    // console.log(test)
    expect(process.env.POSTGRES_HOST).toBe('localhost');
  });
});
