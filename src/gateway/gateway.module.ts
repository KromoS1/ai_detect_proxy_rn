import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { SocketService } from './application/socket.service';

import { HintsModule } from 'src/hints/hints.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HintsModule, UserModule],
  providers: [AppGateway, SocketService],
  exports: [AppGateway],
})
export class GatewayModule {}
