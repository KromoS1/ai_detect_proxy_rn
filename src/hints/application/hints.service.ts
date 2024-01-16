import { Injectable } from '@nestjs/common';

import { CommonHints } from './hints/common-hints';
import { PositionsHints } from './hints/positions.hints';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { LandmarksService } from 'src/face-detector/application/landmarks.service';
import { VariantsTemplateType } from 'src/face-detector/domain/dto/face-detector.service.dto';
import { FilesService } from 'src/helpers/files/application/files.service';
import { TemplateService } from 'src/template/application/template.service';
import { Template } from 'src/template/domain/entity/template.model';

@Injectable()
export class HintsService {
  #client_template: { [key: string]: Template } = {};

  constructor(
    private fdService: FaceDetectorService,
    private landmarksService: LandmarksService,
    private filesService: FilesService,
    private templateService: TemplateService,
    private commonHints: CommonHints,
    private positionsHints: PositionsHints,
  ) {}

  setClientTemplate(client_id: string, template: Template) {
    this.#client_template[client_id] = template;
  }

  removeClientTemplate(client_id: string) {
    delete this.#client_template[client_id];
  }

  async loadTemplate(template_id: number, client_id: string) {
    try {
      const template = await this.templateService.getDataTemplateById(
        template_id,
      );

      if (!template) {
        return null;
      }

      this.setClientTemplate(client_id, template.dataValues);

      return template;
    } catch (error) {
      console.error(error);
    }
  }

  async #getDetectedData(data) {
    const buffer = this.filesService.getBufferFromBase64(
      data.base64,
      data.fileType,
    );

    return await this.fdService.templateDetection(buffer);
  }

  async generateHints(data, client_id: string) {
    const detectData = await this.#getDetectedData(data);

    if (!detectData) return null;

    const {
      type,
      positions: tPositions,
      roll,
      pitch,
      yaw,
      rect: tRect,
    } = this.#client_template[client_id];

    const variantTemplate = type.toUpperCase() as VariantsTemplateType;

    const { positions, angle, rect } = this.landmarksService.getLandmarksData(
      variantTemplate,
      detectData,
    );

    // console.table([
    //   {
    //     roll: angle.roll,
    //     tRoll: roll,
    //     pitch: angle.pitch,
    //     tPitch: pitch,
    //     yaw: angle.yaw,
    //     tYaw: yaw,
    //   },
    // ]);

    return {
      positionsTemp: tPositions,
      hints: {
        roll: this.commonHints.getHints(angle.roll, roll, 'ROLL'), // определение наклона головы влево-вправо
        pitch: this.commonHints.getHints(angle.pitch, pitch, 'PITCH'), // определение наклона головы вперед-назад
        yaw: this.commonHints.getHints(angle.yaw, yaw, 'YAW'), //определение поворота головы влево-вправо
        positions: this.positionsHints.generate(
          positions,
          JSON.parse(tPositions),
        ), //определение позиции лица
        zoom: this.commonHints.getZoom(rect, JSON.parse(tRect)), // Определение зума по площади квадрата головы
      },
    };
  }
}
