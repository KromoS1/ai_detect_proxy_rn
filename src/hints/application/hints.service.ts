import { Injectable } from '@nestjs/common';

import { HintsFactory } from './hints.factory';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { LandmarksService } from 'src/face-detector/application/landmarks.service';
import { VariantsTemplateType } from 'src/face-detector/domain/dto/face-detector.service.dto';
import { FilesService } from 'src/helpers/files/application/files.service';
import { TemplateService } from 'src/template/application/template.service';
import { Template } from 'src/template/domain/entity/template.model';

@Injectable()
export class HintsService {
  client_template: { [key: string]: Template } = {};
  factory: HintsFactory;

  constructor(
    private fdService: FaceDetectorService,
    private landmarksService: LandmarksService,
    private filesService: FilesService,
    private templateService: TemplateService,
  ) {
    this.factory = new HintsFactory();
  }

  setClientTemplate(client_id: string, template: Template) {
    this.client_template[client_id] = template;
  }

  removeClientTemplate(client_id: string) {
    delete this.client_template[client_id];
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

  async getDetectedData(data) {
    const buffer = this.filesService.getBufferFromBase64(
      data.base64,
      data.fileType,
    );

    return await this.fdService.templateDetection(buffer);
  }

  async generateHints(data, client_id: string) {
    const detectData = await this.getDetectedData(data);

    if (!detectData) return [];

    //@ts-ignore
    // console.log(detectData)

    const {type, positions: tPositions, roll, pitch, rect: tRect} = this.client_template[client_id];

    const variantTemplate = type.toUpperCase() as VariantsTemplateType;

    const { positions, angle, rect } = this.landmarksService.getLandmarksData(variantTemplate, detectData);

    const hints = this.factory.createHints(variantTemplate);

    return {
      roll: hints.defineRoll(angle.roll, roll),
      pitch: hints.definePitch(angle.pitch, pitch),
      positions: hints.generate(positions, JSON.parse(tPositions)),
      zoom: hints.defineZoom(rect, JSON.parse(tRect))
    }
  }
}
