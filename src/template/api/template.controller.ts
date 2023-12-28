import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TemplateService } from '../application/template.service';
import {
  AddTemplateQueryDto,
  TemplateParamDto,
} from '../domain/dto/template.request.dto';
import { TemplateResponseDto } from '../domain/dto/template.response.dto';

import { BadRequestResult } from 'src/helpers/exception/badRequestResult';
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
  @ApiResponse({
    status: 400,
    type: BadRequestResult,
    description: 'Ошибка добавления шаблона',
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
        message: 'Вы не указали query parameter',
        fields: ['tmpl'],
      });
    }

    const result = await this.templateService.detectNewTemplate(
      file.originalname,
      file.path,
      queryDo.tmpl,
    );

    if (!result) {
      throw new BadRequestException({
        message: 'Ошибка при добавлении шаблона.',
        fields: ['filename'],
      });
    }

    return { message: 'Шаблон успешно добавлен' };
  }

  @ApiOperation({ summary: 'Удалить шаблон' })
  @ApiResponse({
    status: 200,
    type: '',
    description: 'Успешное удаление шаблона',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResult,
    description: 'Ошибка удаления шаблона',
  })
  @HttpCode(200)
  @Delete(':template_id')
  async removeTemplate(@Param() paramDto: TemplateParamDto) {
    const template = await this.templateService.getDataTemplateById(
      paramDto.template_id,
    );

    if (!template) {
      throw new BadRequestException({
        message: 'Шаблон не найден',
        fields: ['template_id'],
      });
    }

    return await this.templateService.removeTemplate(template);
  }
}
