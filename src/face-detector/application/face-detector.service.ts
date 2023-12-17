import { Injectable } from '@nestjs/common';

import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import * as fs from 'fs';
import * as log from '@vladmandic/pilogger';
import * as path from 'path';

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

    this.optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
      minConfidence,
      maxResults,
    });
  }

  print(face: any) {
    const expression = face.expressions
      ? Object.entries(face.expressions).reduce(
          (acc, val) => (val[1] > acc[1] ? val : acc),
          ['', 0],
        )
      : '';
    const box = [
      face.alignedRect._box._x,
      face.alignedRect._box._y,
      face.alignedRect._box._width,
      face.alignedRect._box._height,
    ];
    const gender = `Gender: ${Math.round(100 * face.genderProbability)}% ${
      face.gender
    }`;
    log.data(
      `Detection confidence: ${Math.round(
        100 * face.detection._score,
      )}% ${gender} Age: ${
        Math.round(10 * face.age) / 10
        //@ts-ignore
      } Expression: ${Math.round(100 * expression[1])}% ${
        expression[0]
      } Box: ${box.map((a) => Math.round(a))}`,
    );
  }

  async image(input) {
    // read input image file and create tensor to be used for processing
    let buffer;
    log.info('Loading image:', input);
    if (input.startsWith('http:') || input.startsWith('https:')) {
      const res = await fetch(input);
      //@ts-ignore
      if (res && res.ok) buffer = await res.buffer();
      else
        log.error(
          'Invalid image URL:',
          input,
          res.status,
          res.statusText,
          res.headers.get('content-type'),
        );
    } else {
      buffer = fs.readFileSync(input);
    }

    // decode image using tfjs-node so we don't need external depenencies
    // can also be done using canvas.js or some other 3rd party image library
    if (!buffer) return {};
    const tensor = tf.tidy(() => {
      //@ts-ignore
      const decode = faceapi.tf.node.decodeImage(buffer, 3);
      console.log(decode);
      let expand;
      if (decode.shape[2] === 4) {
        // input is in rgba format, need to convert to rgb
        //@ts-ignore
        const channels = faceapi.tf.split(decode, 4, 2); // tf.split(tensor, 4, 2); // split rgba to channels
        const rgb = faceapi.tf.stack(
          [channels[0], channels[1], channels[2]],
          2,
        ); // stack channels back to rgb and ignore alpha
        expand = faceapi.tf.reshape(rgb, [
          1,
          decode.shape[0],
          decode.shape[1],
          3,
        ]); // move extra dim from the end of tensor and use it as batch number instead
      } else {
        expand = faceapi.tf.expandDims(decode, 0);
      }
      const cast = faceapi.tf.cast(expand, 'float32');
      return cast;
    });

    return tensor;
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

  async main() {
    const { imgPathRoot } = FDConfig;
    const dir = fs.readdirSync(imgPathRoot);

    for (const img of dir) {
      if (!img.toLocaleLowerCase().endsWith('.jpg')) continue;
      const tensor = await this.image(path.join(imgPathRoot, img));

      const result = await this.detect(tensor);

      this.print(result);

      tensor.dispose();
    }
  }

  async main2(buffer) {
    const { imgPathRoot } = FDConfig;
    const dir = fs.readdirSync(imgPathRoot);

    const tensor = tf.tidy(() => {
      //@ts-ignore
      const decode = faceapi.tf.node.decodeImage(buffer, 3);
      console.log(decode);
      let expand;
      if (decode.shape[2] === 4) {
        // input is in rgba format, need to convert to rgb
        //@ts-ignore
        const channels = faceapi.tf.split(decode, 4, 2); // tf.split(tensor, 4, 2); // split rgba to channels
        const rgb = faceapi.tf.stack(
          [channels[0], channels[1], channels[2]],
          2,
        ); // stack channels back to rgb and ignore alpha
        expand = faceapi.tf.reshape(rgb, [
          1,
          decode.shape[0],
          decode.shape[1],
          3,
        ]); // move extra dim from the end of tensor and use it as batch number instead
      } else {
        expand = faceapi.tf.expandDims(decode, 0);
      }
      const cast = faceapi.tf.cast(expand, 'float32');
      return cast;
    });

    const result = await this.detect(tensor);
    console.log(result);

    tensor.dispose();

    return result;
  }
}
