import { Injectable } from '@nestjs/common';
import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { ITemplateService } from '../domain/dto/template-service.dto';
import { TemplateRepository } from '../infrastructure/template.repository';
import { TemplateQueryRepository } from '../infrastructure/template.queryRepository';
import * as process from 'process';
import { Template } from '../domain/entity/template.model';
import { FilesService } from 'src/files/application/files.service';

@Injectable()
export class TemplateService {
  constructor(
    private fdService: FaceDetectorService,
    private templateRepository: TemplateRepository,
    private templateQueryRepository: TemplateQueryRepository,
    private filesService: FilesService,
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
    const list = this.filesService.listFilesByPath(
      `./assets/template/${variant}`,
    );

    if (list.length) {
      return list.map((fileName, i) => ({
        id: i,
        link: `${process.env.HTTP_PATH}/${variant}/${fileName}`,
      }));
    }

    return [];
  }

  async removeTemplate(template: Template) {
    const { template_id, file_path } = template;

    await this.filesService.removeFile(file_path);

    return await this.templateRepository.removeTemplate(template_id);
  }
}
