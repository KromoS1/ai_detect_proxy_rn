import { Module } from '@nestjs/common';
import { TemplateController } from './api/template.controller';
import { TemplateService } from './application/template.service';
import { FaceDetectorModule } from 'src/face-detector/face-detector.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SequelizeModule } from '@nestjs/sequelize';
import { Template } from './domain/entity/template.model';
import { TemplateRepository } from './infrastructure/template.repository';
import { destination, fileFilter, filename } from './utils';
import { TemplateQueryRepository } from './infrastructure/template.queryRepository';
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
