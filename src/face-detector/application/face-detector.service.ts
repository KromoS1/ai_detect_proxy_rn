import * as path from 'path';

import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import * as log from '@vladmandic/pilogger';

import FDConfig from '../helpers/face-detector.config';

@Injectable()
export class FaceDetectorService {
  fetch: any = null;
  optionsSSDMobileNet: faceapi.SsdMobilenetv1Options | null = null;

  constructor() {
    this.loadModels();
  }

  async loadModels() {
    this.fetch = (await import('node-fetch')).default;

    //@ts-ignore
    await faceapi.tf.setBackend('tensorflow');
    //@ts-ignore
    await faceapi.tf.ready();

    const { modelPathRoot, minConfidence, maxResults } = FDConfig;

    const modelPath = path.join(modelPathRoot);

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

    this.optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
      minConfidence,
      maxResults,
    });
  }

  async detect(tensor) {
    try {
      const result = await faceapi
        .detectSingleFace(tensor, this.optionsSSDMobileNet)
        .withFaceLandmarks();

      return result;
    } catch (err) {
      log.error('Caught error', err.message);

      return [];
    }
  }

  defineTensor(buffer) {
    return tf.tidy(() => {
      //@ts-ignore
      const decode = faceapi.tf.node.decodeImage(buffer, 3);

      let expand;

      if (decode.shape[2] === 4) {
        //@ts-ignore
        const channels = faceapi.tf.split(decode, 4, 2);
        const rgb = faceapi.tf.stack(
          [channels[0], channels[1], channels[2]],
          2,
        );

        expand = faceapi.tf.reshape(rgb, [
          1,
          decode.shape[0],
          decode.shape[1],
          3,
        ]);
      } else {
        expand = faceapi.tf.expandDims(decode, 0);
      }
      const cast = faceapi.tf.cast(expand, 'float32');

      return cast;
    });
  }

  async templateDetection(buffer) {
    const tensor = this.defineTensor(buffer);

    const result = await this.detect(tensor);

    tensor.dispose();

    return result;
  }
}
