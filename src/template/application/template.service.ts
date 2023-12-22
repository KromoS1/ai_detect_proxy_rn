import { Injectable } from '@nestjs/common';
import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { ITemplateService } from '../domain/dto/template-service.dto';
import { TemplateRepository } from '../infrastructure/template.repository';
import { TemplateQueryRepository } from '../infrastructure/template.queryRepository';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class TemplateService {
  constructor(
    private fdService: FaceDetectorService,
    private templateRepository: TemplateRepository,
    private templateQueryRepository: TemplateQueryRepository,
  ) {}

  async detectNewTemplate(
    file_name: string,
    file_path: string,
    buffer: Buffer,
  ) {
    const data_detection = await this.fdService.templateDetection(buffer);

    // TODO вынести это преобразование, может к fase-detection
    //@ts-ignore
    const { x, y } = data_detection.landmarks.shift;
    //@ts-ignore
    const positions = data_detection.landmarks.positions.map((position) => ({
      x: position.x,
      y: position.y,
    }));

    //@ts-ignore
    const { roll, pitch, yaw } = data_detection.angle;

    const template: ITemplateService = {
      file_name,
      file_path,
      roll,
      pitch,
      yaw,
      shift: JSON.stringify({ x, y }).replace('.', ','),
      positions: JSON.stringify(positions).replace('.', ','),
    };

    return await this.templateRepository.addDataTemplate(template);
  }

  async getDataTemplateById(template_id: number) {
    return await this.templateQueryRepository.getTemplateById(template_id);
  }

  async getListTemplates(variant) {
    const list = fs.readdirSync(
      path.join(process.cwd(), `./assets/template/${variant}`),
    );

    if (list.length) {
      return list.map((fileName, i) => ({
        id: i,
        link: `${process.env.HTTP_PATH}/${variant}/${fileName}`,
      }));
    }

    return [];
  }
}
