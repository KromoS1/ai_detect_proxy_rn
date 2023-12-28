import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ITemplateService } from '../domain/dto/template-service.dto';
import { Template } from '../domain/entity/template.model';

@Injectable()
export class TemplateRepository {
  constructor(@InjectModel(Template) private templateRepository: typeof Template) {}

  async addDataTemplate(templateDto: ITemplateService) {
    try {
      return await this.templateRepository.create(templateDto);
    } catch (error) {
      return null;
    }
  }

  async removeTemplate(template_id: number) {
    const result = await this.templateRepository.destroy({
      where: { template_id },
    });

    return result && { template_id };
  }
}
