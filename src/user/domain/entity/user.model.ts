import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', updatedAt: false, createdAt: false })
export class User extends Model<User, undefined> {
  @ApiProperty({ example: 1, description: 'id' })
  @Column({
    unique: true,
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Roma',
    description: 'Имя пользователя',
  })
  @Column({ type: DataType.STRING(30), allowNull: false })
  name: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Почта пользователя',
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  email: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Дата верификаци почты',
  })
  @Column({ type: DataType.DATE })
  email_verified_at: Date;

  @ApiProperty({
    example: '1234dwdd01c',
    description: 'Пароль пользователя',
  })
  @Column({ type: DataType.STRING(36) })
  password: string;

  @ApiProperty({
    example: '1234dwdd01c',
    description: 'Пароль пользователя',
  })
  @Column({ type: DataType.STRING(100) })
  social_id: string;

  @ApiProperty({
    example: 1,
    description: 'Подписка на рассылку',
  })
  @Column({ type: DataType.INTEGER })
  is_news_letter: number;

  @ApiProperty({
    example: 'wdwdw1ee8',
    description: 'Token',
  })
  @Column({ type: DataType.STRING(100) })
  remember_token: string;

  @ApiProperty({
    example: 'dwdqw/',
    description: 'Photo user',
  })
  @Column({ type: DataType.STRING() })
  photo: string;
}
