import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResult {
  @ApiProperty({
    example: 'Сообщение об ошибке',
    description: 'Краткое сообщение об ошибке',
  })
  message: string;

  @ApiProperty({
    example: ['field1', 'field2'],
    description: 'Поля, в которых возникла ошибка',
  })
  fields: string[];
}
