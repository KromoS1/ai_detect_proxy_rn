import { Module } from '@nestjs/common';
import { ImageController } from './api/image.controller';
import { ImageService } from './application/image.service';
import { FaceDetectorModule } from 'src/face-detector/face-detector.module';

@Module({
  controllers: [ImageController],
  imports: [FaceDetectorModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
