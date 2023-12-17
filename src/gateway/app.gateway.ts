import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UploadedFile } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';

@WebSocketGateway({
  transports: ['websocket'],
  maxHttpBufferSize: 1e8,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GATEWAY');

  constructor(private fdService: FaceDetectorService) {}

  afterInit() {
    this.logger.log(`${Server.name} initialized`);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.warn(`open Client_id: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.logger.warn(`close Client_id: ${socket.id}`);
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  //Test event
  @SubscribeMessage('server/msgToServer')
  async handleMessage(socket: Socket, data: any): Promise<WsResponse<any>> {
    return { event: 'client/msgToClient', data: 'hello' };
  }

  @SubscribeMessage('server/detection')
  async handleDataTensor(
    socket: Socket,
    dataString: string,
  ): Promise<WsResponse<any>> {
    const data = JSON.parse(dataString);

    const base64 = data.base64.replace(`data:${data.fileType};base64,`, '');

    const buffer = Buffer.from(base64, 'base64');

    const detectData = await this.fdService.main2(buffer);

    return { event: 'client/detection', data: JSON.stringify(detectData) };
  }
}
