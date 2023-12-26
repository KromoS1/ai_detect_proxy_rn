import { Module } from '@nestjs/common';

import { FaceDetectorService } from './application/face-detector.service';
import { LandmarksService } from './application/landmarks.service';

@Module({
  imports: [],
  providers: [FaceDetectorService, LandmarksService],
  exports: [FaceDetectorService, LandmarksService],
})
export class FaceDetectorModule {}
