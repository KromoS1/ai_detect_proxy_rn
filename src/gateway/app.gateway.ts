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

import { HintsService } from 'src/hints/application/hints.service';

/** @module Socket */
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
  ) {}

  afterInit(server: Server) {
    const middleware = this.socketService.socketMiddleware();

    server.use(middleware);
    this.logger.log(`${AppGateway.name} initialized`);
  }

  /**
   * Функиция запускаемая при подключении к сокету,
   * Будет проверять авторизацию пользователя
   */
  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.warn(`open Client_id: ${socket.id}`);

    // TODO: добавить в логирование сохранение данных пользователя и шаблона

    const { template_id } = socket.handshake.query;

    const isLoad = await this.hintsService.loadTemplate(+template_id as number);

    if (!isLoad) {
      this.logger.error(`close Client_id: ${socket.id} - invalid template_id`);
      this.disconnectSocket(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.logger.warn(`close Client_id: ${socket.id}`);
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  /**
   * Событие 'server/detection'
   * Используется для определения точек по шаблону.
   * @param {string} dataString - строковое представление объекта в котором будет поле base64 картинки без  (data:image/jpeg;base64,)
   * {event: 'client/detection', data: {}} в dat будут подсказки
   */

  @SubscribeMessage('server/detection')
  async handleDataTensor(
    socket: Socket,
    dataString: string,
  ): Promise<WsResponse<any>> {
    const data = JSON.parse(dataString);

    // const hints = await this.hintsService.generateHints(data, 1);

    // if (!detectData)
    //   return { event: 'client/detection', data: JSON.stringify([]) };

    // const hints = [];

    //@ts-ignore
    // console.log(JSON.stringify(detectData?.landmarks._shift, null, 2));

    // const leftHints = this.defineHints(
    //   positions.slice(0, 5),
    //   positionTemplate.slice(0, 5),
    // );
    // const rightHints = this.defineHints(
    //   positions.slice(5, 10),
    //   positionTemplate.slice(5, 10),
    // );

    // const defineH = (hintsCount) => {
    //   const { ok, ...resthint } = hintsCount;

    //   if (!ok) return Object.keys(resthint);

    //   const res = [];

    //   Object.entries(resthint).forEach((h) =>
    //     ok >= h[1] ? res.push(h[0]) : undefined,
    //   );

    //   if (res.length) return res;

    //   return ['ok'];
    // };

    // const l = this.countValues(leftHints);
    // const r = this.countValues(rightHints);

    // const lH = defineH(l);
    // const rH = defineH(r);

    // console.log(l, lH);
    // console.log(r, rH);

    return {
      event: 'client/detection',
      data: JSON.stringify({
        // left: lH,
        // right: rH,
      }),
    };
  }
}
