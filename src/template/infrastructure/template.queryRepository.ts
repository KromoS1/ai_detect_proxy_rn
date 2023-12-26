import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Template } from '../domain/entity/template.model';

@Injectable()
export class TemplateQueryRepository {
  constructor(@InjectModel(Template) private templateQueryRepository: typeof Template) {}

  async getTemplateById(template_id: number) {
    return await this.templateQueryRepository.findOne({
      where: { template_id },
    });
  }
}
