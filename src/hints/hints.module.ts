import { Module } from '@nestjs/common';

import { CommonHints } from './application/hints/common-hints';
import { PositionsHints } from './application/hints/positions.hints';
import { HintsService } from './application/hints.service';

import { FaceDetectorModule } from 'src/face-detector/face-detector.module';
import { FilesModule } from 'src/helpers/files/files.module';
import { TemplateModule } from 'src/template/template.module';

@Module({
  imports: [FaceDetectorModule, TemplateModule, FilesModule],
  providers: [HintsService, CommonHints, PositionsHints],
  exports: [HintsService],
})
export class HintsModule {}
