import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResult {
  @ApiProperty({
    example: 'Вы не авторизованы',
    description: 'Краткое сообщение об ошибке',
  })
  message: string;

  @ApiProperty({
    example: ['accessToken', 'refreshToken'],
    description: 'Поля, в которых возникла ошибка',
  })
  fields: string[];
}
