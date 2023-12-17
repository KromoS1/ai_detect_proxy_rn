import { Module } from '@nestjs/common';
import { FaceDetectorService } from './application/face-detector.service';

@Module({
  imports: [],
  providers: [FaceDetectorService],
  exports: [FaceDetectorService],
})
export class FaceDetectorModule {}
