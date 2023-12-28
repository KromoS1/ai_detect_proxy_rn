import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export type TypeTemplate = 'eyebrows' | 'lips' | 'hand';

export class AddTemplateQueryDto {
  @ApiProperty({ example: 'eyebrows', description: 'Поле для типа шаблон' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString({ message: 'Значение должно быть строкой' })
  tmpl: TypeTemplate;
}

export class TemplateParamDto {
  @ApiProperty({ example: 12, description: 'Айди шаблна' })
  @IsInt({ message: 'Айди шаблона должно быть числом' })
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'Обязательное поле' })
  template_id: number;
}
