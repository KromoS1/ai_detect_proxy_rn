import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketService } from './application/socket.service';

import { KromLogger } from 'src/helpers/logger/logger.service';
import { HintsService } from 'src/hints/application/hints.service';

@WebSocketGateway({
  transports: ['websocket'],
  maxHttpBufferSize: 1e8,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GATEWAY');

  constructor(
    private hintsService: HintsService,
    private socketService: SocketService,
    private kromLogger: KromLogger,
  ) {}

  afterInit(server: Server) {
    const middleware = this.socketService.socketMiddleware();

    server.use(middleware);
    this.kromLogger.socket('log', `${AppGateway.name} initialized`);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    const { template_id, user_id } = socket.handshake.query;

    const isLoad = await this.hintsService.loadTemplate(
      +template_id as number,
      socket.id,
    );

    if (!isLoad) {
      this.kromLogger.socket(
        'error',
        `invalid template_id = ${template_id}`,
        socket.id,
      );
      this.disconnectSocket(socket);
    }

    this.kromLogger.socket(
      'log',
      `Open connection: user_id = ${user_id}, template_id = ${template_id}`,
      socket.id,
    );
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.hintsService.removeClientTemplate(socket.id);
    this.logger.warn(`close Client_id: ${socket.id}`);
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('server/detection')
  async handleDataTensor(
    socket: Socket,
    dataString: string,
  ): Promise<WsResponse<any>> {
    const data = JSON.parse(dataString);

    const hints = await this.hintsService.generateHints(data, socket.id);

    return {
      event: 'client/detection',
      data: JSON.stringify(hints),
    };
  }
}
