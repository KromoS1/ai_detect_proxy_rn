import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { FaceDetectorModule } from './face-detector/face-detector.module';
import { TemplateModule } from './template/template.module';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Template } from './template/domain/entity/template.model';
import { UserModule } from './user/user.module';
import { User } from './user/domain/entity/user.model';
import { FilesModule } from './files/files.module';

@Module({
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
  ],
})
export class AppModule {}
