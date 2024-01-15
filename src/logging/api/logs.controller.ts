import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BadRequestResult } from '../../helpers/exception/badRequestResult';
import { LogsService } from '../application/logs.service';
import { LogQueryDto } from '../domain/dot/log.query.dto';

@ApiTags('Логи запросов')
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @ApiOperation({ summary: 'Получение списка дат с логами' })
  @ApiResponse({
    status: 200,
    type: [String],
    description: 'Успешное получение списка логов (массив дат)',
  })
  @HttpCode(200)
  @Get()
  async getAllLogs() {
    return await this.logsService.getAll();
  }

  @ApiOperation({ summary: 'Получение лога по имени файла' })
  @ApiResponse({
    status: 200,
    type: '',
    description: 'Успешное получение файла логов',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResult,
    description: 'Такого файла не существует',
  })
  @HttpCode(200)
  @Get('/log')
  async getDailyLog(@Query() query: LogQueryDto) {
    const logfile = await this.logsService.getSpecificLog(
      query.date,
      query.file_name,
    );

    if (!logfile) {
      throw new BadRequestException('ошибка запроса');
    }

    return logfile;
  }
}
