import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { FaceDetectorModule } from './face-detector/face-detector.module';
import { ImageModule } from './image/image.module';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    GatewayModule,
    FaceDetectorModule,
    ImageModule,
    LoggerModule,
  ],
})
export class AppModule {}
