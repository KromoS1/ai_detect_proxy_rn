import { Module } from '@nestjs/common';
import { FilesService } from './application/files.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [],
  imports: [LoggerModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
