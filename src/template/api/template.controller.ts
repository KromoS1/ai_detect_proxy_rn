import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TemplateService } from '../application/template.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddTemplateQueryDto } from '../domain/dto/template.request.dto';
import { TemplateResponseDto } from '../domain/dto/template.response.dto';
import { promises as fsPromises } from 'fs';

@ApiTags('Шаблоны')
@Controller('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @ApiOperation({ summary: 'Получение списка шаблонов по категориям' })
  @ApiResponse({
    status: 200,
    type: [String],
    description: 'Успешная получение списка шаблонов',
  })
  @HttpCode(201)
  @Get('/list')
  async getListTemplates(@Query('variant') variant: string) {
    return await this.templateService.getListTemplates(variant);
  }

  @ApiOperation({ summary: 'Добавление шаблона' })
  @ApiResponse({
    status: 201,
    type: TemplateResponseDto,
    description: 'Успешное добавление шаблона',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  @Post()
  async add_template(
    @Query() queryDo: AddTemplateQueryDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!queryDo.tmpl) {
      throw new BadRequestException({
        message: 'Вы не указали query parameter -> tmpl',
      });
    }
    const buffer = await fsPromises.readFile(file.path);

    const result = await this.templateService.detectNewTemplate(
      file.originalname,
      file.path,
      buffer,
    );

    if (!result) {
      throw new BadRequestException({
        message: 'Ошибка при добавлении шаблона',
      });
    }

    return { message: 'Шаблон успешно добавлен' };
  }
}
