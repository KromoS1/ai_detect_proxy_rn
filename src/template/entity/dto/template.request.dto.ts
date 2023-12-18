import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export type TypeTemplate = 'eyebrows' | 'lips' | 'hand';

export class AddTemplateQueryDto {
  @ApiProperty({ example: 'eyebrows', description: 'Поле для типа шаблон' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString({ message: 'Значение должно быть строкой' })
  tmpl: TypeTemplate;
}
