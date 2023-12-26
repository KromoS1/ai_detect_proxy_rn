import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';

import { FaceDetectorModule } from 'src/face-detector/face-detector.module';

@Module({
  imports: [FaceDetectorModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GatewayModule {}
