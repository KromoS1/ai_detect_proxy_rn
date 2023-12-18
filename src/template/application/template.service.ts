import { Injectable } from '@nestjs/common';
import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';

@Injectable()
export class TemplateService {
  constructor(private fdService: FaceDetectorService) {}

  async detectNewTemplate(buffer: Buffer) {
    // return this.fdService

    const res = await this.fdService.templateDetection(buffer);

    return true;
  }
}
