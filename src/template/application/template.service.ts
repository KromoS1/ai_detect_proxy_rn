import * as process from 'process';

import { Injectable } from '@nestjs/common';

import { ITemplateService } from '../domain/dto/template-service.dto';
import { Template } from '../domain/entity/template.model';
import { TemplateQueryRepository } from '../infrastructure/template.queryRepository';
import { TemplateRepository } from '../infrastructure/template.repository';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { LandmarksService } from 'src/face-detector/application/landmarks.service';
import { VariantsTemplateType } from 'src/face-detector/domain/dto/face-detector.service.dto';
import { FilesService } from 'src/helpers/files/application/files.service';

@Injectable()
export class TemplateService {
  constructor(
    private fdService: FaceDetectorService,
    private templateRepository: TemplateRepository,
    private templateQueryRepository: TemplateQueryRepository,
    private filesService: FilesService,
    private landmarksService: LandmarksService,
  ) {}

  async detectNewTemplate(file_name: string, file_path: string, type: string) {
    const buffer = await this.filesService.getBuffer(file_path);
    const data_detection = await this.fdService.templateDetection(buffer);

    const { positions, shift, imgDims } = this.landmarksService.getLandmarksData(
      type.toUpperCase() as VariantsTemplateType,
      data_detection,
    );

    const template: ITemplateService = {
      type,
      file_name,
      file_path,
      imgDims: JSON.stringify(imgDims),
      shift: JSON.stringify(shift),
      positions: JSON.stringify(positions),
    };

    return await this.templateRepository.addDataTemplate(template);
  }

  async getDataTemplateById(template_id: number) {
    return await this.templateQueryRepository.getTemplateById(template_id);
  }

  async getListTemplates(variant) {
    const list = this.filesService.listFilesByPath(`./assets/template/${variant}`);

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
