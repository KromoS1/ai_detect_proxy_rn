import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { SocketService } from './application/socket.service';

import { LoggerModule } from 'src/helpers/logger/logger.module';
import { HintsModule } from 'src/hints/hints.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HintsModule, UserModule, LoggerModule],
  providers: [AppGateway, SocketService],
  exports: [AppGateway],
})
export class GatewayModule {}
