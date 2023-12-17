import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { FaceDetectorModule } from './face-detector/face-detector.module';
import { ImageModule } from './image/image.module';

@Module({
  controllers: [],
  providers: [],
  imports: [GatewayModule, FaceDetectorModule, ImageModule],
})
export class AppModule {}
