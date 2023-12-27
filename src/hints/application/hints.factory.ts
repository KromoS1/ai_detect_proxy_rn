import { EyebrowsHints } from './hints/eyebrows.hints';

import { VariantsTemplateType } from 'src/face-detector/domain/dto/face-detector.service.dto';

export class HintsFactory {
  createHints(type: VariantsTemplateType) {
    if (type === 'EYEBROWS') {
      return new EyebrowsHints();
    } else {
      throw new Error('Invalid hints type.');
    }
  }
}
