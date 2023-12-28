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

  /**
   * Метод запускается автоматически после запуска проекта и инициализации модулей.
   * В методе запускается создание и привязка middleware для проверки пользователя, который будет подключаться
   * Проверка осуществляется по user_id и email
   */
  afterInit(server: Server) {
    const middleware = this.socketService.socketMiddleware();

    server.use(middleware);
    this.kromLogger.socket('log', `${AppGateway.name} initialized`);
  }

  /**
   * Метод запускается автоматически после соединения с пользователем.
   * В методе вызывается поиск и сохранение шаблона для использования в сокете.
   * Если шаблон найдет пользователю возвращается событие client/data_template с data: imgDims - количество логических пикселей изображения шаблона
   */
  async handleConnection(socket: Socket, ...args: any[]) {
    const { template_id, user_id } = socket.handshake.query;

    this.kromLogger.socket(
      'log',
      `Open: user_id = ${user_id}, template_id = ${template_id}`,
      socket.id,
    );

    const template = await this.hintsService.loadTemplate(
      +template_id as number,
      socket.id,
    );

    if (!template) {
      this.kromLogger.socket(
        'error',
        `invalid template_id = ${template_id}`,
        socket.id,
      );
      this.disconnectSocket(socket);
    }

    socket.emit('client/data_template', {
      imgDims: JSON.parse(template.imgDims),
    });
  }

  handleDisconnect(socket: Socket) {
    const { template_id, user_id } = socket.handshake.query;

    this.disconnectSocket(socket);
    this.hintsService.removeClientTemplate(socket.id);

    this.kromLogger.socket(
      'log',
      `Close: user_id = ${user_id}, template_id = ${template_id}`,
      socket.id,
    );
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  /**
   * Подписка на событие получения данных для опеределения точек по зараннее выбранному шаблону
   * Пользователю возвращается событие client/detection с data: hints - Array | Object
   */
  @SubscribeMessage('server/detection')
  async handleDataTensor(socket: Socket, data: any): Promise<WsResponse<any>> {
    // const data = JSON.parse(dataString);

    const hints = await this.hintsService.generateHints(data, socket.id);

    return {
      event: 'client/detection',
      data: hints,
    };
  }
}
