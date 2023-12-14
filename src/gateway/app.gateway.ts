import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import * as path from 'path';

import { Tensor } from '@tensorflow/tfjs';

@WebSocketGateway({
  transports: ['websocket'],
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  detector: any = null;
  configSSD: any = null;

  private logger: Logger = new Logger('GATEWAY');

  afterInit() {
    this.logger.log(`${Server.name} initialized`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.warn(`open Client_id: ${socket.id}`);

    const { Canvas, Image, ImageData } = canvas;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await faceapi.nets.faceLandmark68Net.loadFromDisk(
      path.resolve('./AI_models'),
    );

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.resolve('./AI_models'));

    this.configSSD = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 });
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.logger.warn(`close Client_id: ${socket.id}`);
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('server/msgToServer')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(socket: Socket, data: any): WsResponse<any> {
    return { event: 'client/msgToClient', data: { name: 'roma' } };
  }

  @SubscribeMessage('server/DataTensor')
  async handleDataTensor(socket: Socket, data: any): Promise<WsResponse<any>> {
    try {
      const tensor = JSON.parse(data);

      const input = faceapi.tf.browser.fromPixels(tensor);
      const detectionsWithLandmarks = await faceapi
        .detectAllFaces(input, this.configSSD)
        .withFaceLandmarks(true);
      console.log(detectionsWithLandmarks);
    } catch (error: any) {
      console.log(error.message);
    }
    return { event: 'client/DateTensor', data: 'okey' };
  }
}
