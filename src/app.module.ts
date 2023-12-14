import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  controllers: [],
  providers: [],
  imports: [GatewayModule],
})
export class AppModule {}
