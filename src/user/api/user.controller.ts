import { Controller, Get } from '@nestjs/common';

import { UserQueryRepository } from '../infrastructure/user.queryRepository';

@Controller('users')
export class UserController {
  constructor(private userRepo: UserQueryRepository) {}

  @Get()
  async getAllUsers() {
    return await this.userRepo.getAllUsers();
  }
}
