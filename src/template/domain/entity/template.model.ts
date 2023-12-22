import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ITemplateService } from '../dto/template-service.dto';

@Table({ tableName: 'template', updatedAt: false, createdAt: false })
export class Template extends Model<Template, ITemplateService> {
  @ApiProperty({ example: 1, description: 'template_id' })
  @Column({
    unique: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  template_id: number;

  @ApiProperty({
    example: 'eyebrows.jpg',
    description: 'Название файла шаблона',
  })
  @Column({ type: DataType.STRING(30), allowNull: false })
  file_name: string;

  @ApiProperty({
    example: 'home/user/assets/eyebrows.jpg',
    description: 'Путь к файлу шаблона',
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  file_path: string;

  // @ApiProperty({
  //   example: '{"width": 3024, "height":3697}',
  //   description: 'Количество логических пикселей изображения',
  // })
  // @Column({ type: DataType.STRING(50), allowNull: false })
  // imageDims: string;

  @ApiProperty({
    example: 12,
    description: 'Угол поворота чего-то',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  roll: number;

  @ApiProperty({
    example: 10,
    description: 'что-то',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  pitch: number;

  @ApiProperty({
    example: 20,
    description: 'Угол поворота чего-то',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  yaw: number;

  @ApiProperty({
    example: '{_x: 20, _y: 20}',
    description: 'Строка объекта ..',
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  shift: string;

  @ApiProperty({
    example: '[{},{},{}]',
    description: 'Массив точек строкой',
  })
  @Column({ type: DataType.STRING(), allowNull: false })
  positions: string;
}
