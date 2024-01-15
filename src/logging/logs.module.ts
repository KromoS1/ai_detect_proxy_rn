import { Module } from '@nestjs/common';

import { LogsController } from './api/logs.controller';
import { LogsService } from './application/logs.service';

@Module({
  imports: [],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [],
})
export class LogsModule {}
