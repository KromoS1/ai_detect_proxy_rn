import { Module } from '@nestjs/common';
import { TemplateController } from './api/template.controller';
import { TemplateService } from './application/template.service';
import { FaceDetectorModule } from 'src/face-detector/face-detector.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [TemplateController],
  imports: [
    FaceDetectorModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, `./assets/template/${req.query.tmpl}`); // Путь для сохранения файлов
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png']; // Разрешенные MIME-типы файлов
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Неподдерживаемый формат файла'), false);
        }
      },
    }),
  ],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
