import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '../application/image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@ApiTags('Шаблоны')
@Controller('template')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @ApiOperation({ summary: 'Получение списка шаблонов по категориям' })
  @ApiResponse({
    status: 200,
    type: undefined,
    description: 'Успешная получение списка шаблонов',
  })
  @HttpCode(201)
  @Get()
  async getListTemplates() {}

  @ApiOperation({ summary: 'Добавление шаблона' })
  @ApiResponse({
    status: 200,
    type: undefined,
    description: 'Успешное добавление шаблона',
  })
  @HttpCode(201)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/template',
        filename: (req, file, cb) => {
          cb(null, `${req.query.tmpl}/${file.originalname}`);
        },
      }),
    }),
  )
  async add_template(@Query() queryDto: { tmpl?: string }) {
    return 'success';
  }
}
