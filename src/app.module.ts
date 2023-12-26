import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';

import { FaceDetectorModule } from './face-detector/face-detector.module';
import { GatewayModule } from './gateway/gateway.module';
import { FilesModule } from './helpers/files/files.module';
import { LoggerModule } from './helpers/logger/logger.module';
import { CronTasksService } from './helpers/scheduler/cron-tasks.service';
import { HintsModule } from './hints/hints.module';
import { Template } from './template/domain/entity/template.model';
import { TemplateModule } from './template/template.module';
import { User } from './user/domain/entity/user.model';
import { UserModule } from './user/user.module';

@Module({
  providers: [CronTasksService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      //@ts-ignore
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [Template, User],
      logging: false,
      retryAttempts: 5,
      autoLoadModels: true,
    }),
    GatewayModule,
    FaceDetectorModule,
    TemplateModule,
    LoggerModule,
    UserModule,
    FilesModule,
    HintsModule,
  ],
})
export class AppModule {}
