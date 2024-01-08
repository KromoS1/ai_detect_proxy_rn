import {
  Difference,
  TDifference,
} from 'src/hints/domain/dto/hints.service.dto';
import { Dims } from 'src/template/domain/dto/template-service.dto';

export class CommonHints {
  getHints(
    value: number,
    templateValue: number,
    differenceType: TDifference,
  ): number {
    const difference = Difference[differenceType];

    if (value - difference > templateValue) {
      return -1;
    } else if (value + difference < templateValue) {
      return 1;
    } else return 0;
  }

  getZoom(rect: Dims, templateRect: Dims) {
    const square = rect.width * rect.height;
    const tSquare = templateRect.width * templateRect.height;

    return this.getHints(square, tSquare, 'ZOOM');
  }
}
