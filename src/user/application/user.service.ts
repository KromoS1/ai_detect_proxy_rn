import { UserQueryRepository } from '../infrastructure/user.queryRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async getUserById(id: number) {
    return await this.userQueryRepository.getUserById(id);
  }
}
