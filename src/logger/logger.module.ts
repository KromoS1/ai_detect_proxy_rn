import { Module } from '@nestjs/common';
import { KromLogger } from './logger.service';

@Module({
  providers: [KromLogger],
  exports: [KromLogger],
})
export class LoggerModule {}
