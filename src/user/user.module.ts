import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './api/user.controller';
import { UserService } from './application/user.service';
import { User } from './domain/entity/user.model';
import { UserQueryRepository } from './infrastructure/user.queryRepository';

@Module({
  controllers: [UserController],
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserQueryRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
