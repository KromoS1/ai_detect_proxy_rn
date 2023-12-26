import { Injectable } from '@nestjs/common';

import { UserQueryRepository } from '../infrastructure/user.queryRepository';

@Injectable()
export class UserService {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async getUserById(id: number) {
    return await this.userQueryRepository.getUserById(id);
  }

  async getUserByParams(id: number, email: string) {
    return await this.userQueryRepository.getUserById(id);
  }
}
