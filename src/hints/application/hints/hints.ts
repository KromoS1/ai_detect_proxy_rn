import { Dims } from 'src/template/domain/dto/template-service.dto';

export interface IHints {
  generate: (positions, positionTemplate) => any;
}

export class Hints {
  countValuesHints(arr) {
    return arr.reduce((count, value) => {
      count[value] = (count[value] || 0) + 1;

      return count;
    }, {});
  }

  // определение наклона головы влево-вправо
  defineRoll(roll, templateRoll) {
    const difference = 20;

    if (roll - difference > templateRoll) {
      return ['right'];
    } else if (roll + difference < templateRoll) {
      return ['left'];
    } else {
      return ['ok'];
    }
  }

  // определение наклона головы вперед-назад
  definePitch(pitch: number, templatePitch: number) {
    if (pitch > templatePitch) {
    }
  }

  //определение поворота головы влево-вправо
  defineYaw(yaw: number, templateYaw: number) {}

  // Определение зума по площади квадрата головы
  defineZoom(rect: Dims, templateRect: Dims) {
    const square = rect.width * rect.height;
    const tSquare = templateRect.width * templateRect.height;

    if (square < tSquare) {
      return ['приблизить'];
    } else if (square > tSquare) {
      return ['отдалить'];
    }
  }
}
