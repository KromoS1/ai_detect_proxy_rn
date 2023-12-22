import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../domain/entity/user.model';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User) private userQueryRepository: typeof User) {}

  async getAllUsers() {
    return await this.userQueryRepository.findAll();
  }
}
