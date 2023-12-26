import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { diskStorage } from 'multer';

import { TemplateController } from './api/template.controller';
import { TemplateService } from './application/template.service';
import { Template } from './domain/entity/template.model';
import { TemplateQueryRepository } from './infrastructure/template.queryRepository';
import { TemplateRepository } from './infrastructure/template.repository';
import { destination, fileFilter, filename } from './utils';

import { FaceDetectorModule } from 'src/face-detector/face-detector.module';
import { FilesModule } from 'src/helpers/files/files.module';

@Module({
  controllers: [TemplateController],
  imports: [
    SequelizeModule.forFeature([Template]),
    FaceDetectorModule,
    FilesModule,
    MulterModule.register({
      storage: diskStorage({
        destination,
        filename,
      }),
      fileFilter,
    }),
  ],
  providers: [TemplateService, TemplateRepository, TemplateQueryRepository],
  exports: [TemplateService, TemplateQueryRepository],
})
export class TemplateModule {}
