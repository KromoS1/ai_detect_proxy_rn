import { ApiProperty } from '@nestjs/swagger';

export class TemplateResponseDto {
  @ApiProperty({ description: 'Информация о результате добавления' })
  message: string;
}
