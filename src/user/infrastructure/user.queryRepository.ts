import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../domain/entity/user.model';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User) private userQueryRepository: typeof User) {}

  async getAllUsers() {
    return await this.userQueryRepository.findAll();
  }

  async getUserById(id: number) {
    return await this.userQueryRepository.findOne({ where: { id } });
  }

  async getUserByParams(id: number, email: string) {
    return await this.userQueryRepository.findOne({ where: { id, email } });
  }
}
