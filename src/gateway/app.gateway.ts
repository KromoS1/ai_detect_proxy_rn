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

import * as tf from '@tensorflow/tfjs-node';

import * as faceapi from '@vladmandic/face-api';
import * as fs from 'fs';
import * as process from 'process';
import * as log from '@vladmandic/pilogger';
import * as path from 'path';

import formidable from 'formidable';
import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';

const modelPathRoot = './AI_models';
const imgPathRoot = './img'; // modify to include your sample images
const minConfidence = 0.2;
const maxResults = 1;
let optionsSSDMobileNet;
let fetch;

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

  // print(face: any) {
  //   const expression = face.expressions
  //     ? Object.entries(face.expressions).reduce(
  //         (acc, val) => (val[1] > acc[1] ? val : acc),
  //         ['', 0],
  //       )
  //     : '';
  //   const box = [
  //     face.alignedRect._box._x,
  //     face.alignedRect._box._y,
  //     face.alignedRect._box._width,
  //     face.alignedRect._box._height,
  //   ];
  //   const gender = `Gender: ${Math.round(100 * face.genderProbability)}% ${
  //     face.gender
  //   }`;
  //   log.data(
  //     `Detection confidence: ${Math.round(
  //       100 * face.detection._score,
  //     )}% ${gender} Age: ${
  //       Math.round(10 * face.age) / 10
  //       //@ts-ignore
  //     } Expression: ${Math.round(100 * expression[1])}% ${
  //       expression[0]
  //     } Box: ${box.map((a) => Math.round(a))}`,
  //   );
  // }

  // async image(input) {
  //   // read input image file and create tensor to be used for processing
  //   let buffer;
  //   log.info('Loading image:', input);
  //   if (input.startsWith('http:') || input.startsWith('https:')) {
  //     const res = await fetch(input);
  //     if (res && res.ok) buffer = await res.buffer();
  //     else
  //       log.error(
  //         'Invalid image URL:',
  //         input,
  //         res.status,
  //         res.statusText,
  //         res.headers.get('content-type'),
  //       );
  //   } else {
  //     buffer = fs.readFileSync(input);
  //   }

  //   // decode image using tfjs-node so we don't need external depenencies
  //   // can also be done using canvas.js or some other 3rd party image library
  //   if (!buffer) return {};
  //   const tensor = tf.tidy(() => {
  //     //@ts-ignore
  //     const decode = faceapi.tf.node.decodeImage(buffer, 3);
  //     console.log(decode);
  //     let expand;
  //     if (decode.shape[2] === 4) {
  //       // input is in rgba format, need to convert to rgb
  //       //@ts-ignore
  //       const channels = faceapi.tf.split(decode, 4, 2); // tf.split(tensor, 4, 2); // split rgba to channels
  //       const rgb = faceapi.tf.stack(
  //         [channels[0], channels[1], channels[2]],
  //         2,
  //       ); // stack channels back to rgb and ignore alpha
  //       expand = faceapi.tf.reshape(rgb, [
  //         1,
  //         decode.shape[0],
  //         decode.shape[1],
  //         3,
  //       ]); // move extra dim from the end of tensor and use it as batch number instead
  //     } else {
  //       expand = faceapi.tf.expandDims(decode, 0);
  //     }
  //     const cast = faceapi.tf.cast(expand, 'float32');
  //     return cast;
  //   });

  //   console.log('img tensor ', tensor);
  //   return tensor;
  // }

  // async detect(tensor) {
  //   try {
  //     const result = await faceapi
  //       .detectSingleFace(tensor, optionsSSDMobileNet)
  //       .withFaceLandmarks();
  //     return result;
  //   } catch (err) {
  //     log.error('Caught error', err.message);
  //     return [];
  //   }
  // }

  // // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  // detectPromise(tensor) {
  //   return new Promise((resolve) =>
  //     faceapi
  //       .detectAllFaces(tensor, optionsSSDMobileNet)
  //       .withFaceLandmarks()
  //       .withFaceExpressions()
  //       .withFaceDescriptors()
  //       .withAgeAndGender()
  //       //@ts-ignore
  //       .then((res) => resolve(res))
  //       .catch((err) => {
  //         log.error('Caught error', err.message);
  //         resolve([]);
  //       }),
  //   );
  // }

  // async main() {
  //   log.header();
  //   log.info('FaceAPI single-process test');

  //   fetch = (await import('node-fetch')).default;

  //   //@ts-ignore
  //   await faceapi.tf.setBackend('tensorflow');
  //   //@ts-ignore
  //   await faceapi.tf.ready();

  //   log.state(
  //     //@ts-ignore
  //     `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
  //       faceapi.version
  //       //@ts-ignore
  //     } Backend: ${faceapi.tf?.getBackend()}`,
  //   );

  //   log.info('Loading FaceAPI models');
  //   const modelPath = path.join(modelPathRoot);
  //   await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  //   // await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
  //   await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  //   // await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  //   // await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
  //   optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
  //     minConfidence,
  //     maxResults,
  //   });

  //   const dir = fs.readdirSync(imgPathRoot);

  //   for (const img of dir) {
  //     if (!img.toLocaleLowerCase().endsWith('.jpg')) continue;
  //     const tensor = await this.image(path.join(imgPathRoot, img));

  //     const result = await this.detect(tensor);

  //     // this.print(result);

  //     tensor.dispose();
  //   }
  // }

  // async main2(tensor) {
  //   log.header();
  //   log.info('FaceAPI single-process test');

  //   //@ts-ignore
  //   await faceapi.tf.setBackend('tensorflow');
  //   //@ts-ignore
  //   await faceapi.tf.ready();

  //   log.state(
  //     //@ts-ignore
  //     `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
  //       faceapi.version
  //       //@ts-ignore
  //     } Backend: ${faceapi.tf?.getBackend()}`,
  //   );

  //   log.info('Loading FaceAPI models');
  //   const modelPath = path.join(modelPathRoot);
  //   await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  //   // await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
  //   await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  //   // await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  //   // await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
  //   optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
  //     minConfidence,
  //     maxResults,
  //   });

  //   const result = await this.detect(tensor);

  //   this.print(result);
  //   tensor.dispose();
  // }

  afterInit() {
    this.logger.log(`${Server.name} initialized`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  @SubscribeMessage('server/msgToServer')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(socket: Socket, data: any): WsResponse<any> {
    this.fdService.main();

    return { event: 'client/msgToClient', data: { name: 'roma' } };
  }

  @SubscribeMessage('server/DataTensor')
  async handleDataTensor(
    socket: Socket,
    dataString: any,
  ): Promise<WsResponse<any>> {
    // !!!!!  work version
    // const t3 = tf.tensor3d(buffer.data, shape, dataType);
    // const t4 = t3.expandDims(0);

    // const decode = faceapi.tf.node.decodeImage(buffer, 3);
    // console.log(decode);
    // const expand = faceapi.tf.expandDims(t3, 0);

    // const cast = faceapi.tf.cast(expand, 'float32');

    // const t4 = t3.expandDims(0);
    // // console.log(t3);
    // await this.main2(t3);

    return { event: 'client/DateTensor', data: 'okey' };
  }
}
