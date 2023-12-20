import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './domain/entity/user.model';
import { UserQueryRepository } from './infrastructure/user.queryRepository';
import { UserController } from './api/user.controller';

@Module({
  controllers: [UserController],
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserQueryRepository],
  exports: [],
})
export class UserModule {}
