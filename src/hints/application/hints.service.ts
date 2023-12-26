import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Transform } from 'class-transformer';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { LandmarksService } from 'src/face-detector/application/landmarks.service';
import { VariantsTemplateType } from 'src/face-detector/domain/dto/face-detector.service.dto';
import { FilesService } from 'src/helpers/files/application/files.service';
import { TemplateService } from 'src/template/application/template.service';
import { Template } from 'src/template/domain/entity/template.model';

@Injectable()
export class HintsService {
  template: Template | null = null;

  constructor(
    private fdService: FaceDetectorService,
    private landmarksService: LandmarksService,
    private filesService: FilesService,
    private templateService: TemplateService,
  ) {}

  async loadTemplate(template_id: number) {
    const template = await this.templateService.getDataTemplateById(
      template_id,
    );

    if (!template) {
      return false;
    }

    this.template = template;

    return true;
  }

  async getDetectedData(data) {
    const buffer = this.filesService.getBufferFromBase64(
      data.base64,
      data.fileType,
    );

    return await this.fdService.templateDetection(buffer);
  }

  async getPositions(template: Template, data) {}

  async generateHints(data) {
    const detectData = await this.getDetectedData(data);

    if (!detectData) return [];

    // const { positions } = this.landmarksService.getLandmarksData(
    //   template.type.toUpperCase() as VariantsTemplateType,
    //   detectData,
    // );
  }
}

// defineHints(positions, positionTemplate) {
//   const hints = [];

//   console.log(positions);
//   console.log(positionTemplate);

//   for (let i = 0; i < positions.length; i++) {
//     const { x: tx, y: ty } = positionTemplate[i];
//     const { x, y } = positions[i];

//     const distance = 300;

//     // console.log('плюс x ', x, ' tx ', tx + 250);
//     // console.log('минус x ', x, ' tx ', tx - 250);
//     // console.log('плюс y ', y, ' ty ', ty + 150);
//     // console.log('минус y ', y, ' ty ', ty - 150);

//     if (
//       tx < x + distance &&
//       tx > x - distance &&
//       ty < y + distance &&
//       ty > y - distance
//     ) {
//       hints.push('ok');
//       continue;
//     }

//     if (tx > x + distance) {
//       hints.push('right');
//     } else if (tx < x - distance) {
//       hints.push('left');
//     }

//     if (ty > y + distance) {
//       hints.push('up');
//     } else if (ty < y - distance) {
//       hints.push('down');
//     }
//   }

//   return hints;
// }

// countValues(arr) {
//   return arr.reduce((count, value) => {
//     count[value] = (count[value] || 0) + 1;

//     return count;
//   }, {});
// }
