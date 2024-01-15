import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogQueryDto {
  @ApiProperty({ example: '24-03-2023', description: 'Дата запроса логов' })
  @IsString({ message: 'Дата должна быть в формате 24-03-2023' })
  date: string;

  @ApiProperty({ example: 'log | socket', description: 'имя файла' })
  @IsString({ message: 'Должно быть строкой' })
  file_name: string;
}
