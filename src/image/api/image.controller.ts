import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '../application/image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';

@Controller('image')
export class ImageController {
  constructor(
    private imageService: ImageService,
    private fdService: FaceDetectorService,
  ) {}

  @HttpCode(200)
  @Get()
  async pick() {
    return { text: 'Hello World!' };
  }

  // @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.fdService.main2(file.buffer);
  }
}
