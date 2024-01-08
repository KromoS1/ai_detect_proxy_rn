import { ShiftDto } from 'src/face-detector/domain/dto/detection.dto';
import { Difference, IHints } from 'src/hints/domain/dto/hints.service.dto';

export class PositionsHints implements IHints {
  #countValuesHints(arr) {
    return arr.reduce((count, value) => {
      count[value] = (count[value] || 0) + 1;

      return count;
    }, {});
  }

  #updateDirection(hints) {
    if (hints['left'] && hints['right']) {
      hints['left'] > hints['right']
        ? delete hints['right']
        : delete hints['left'];
    }

    if (hints['up'] && hints['down']) {
      hints['up'] > hints['down'] ? delete hints['down'] : delete hints['up'];
    }

    return hints;
  }

  #defineHints(hintsCount) {
    const { ok, ...resthint } = hintsCount;

    if (!ok) return Object.keys(resthint);

    const hints = this.#updateDirection(resthint);

    const res = [];

    Object.entries(hints).forEach((h) =>
      ok <= h[1] ? res.push(h[0]) : undefined,
    );

    if (res.length) return res;

    return ['ok'];
  }

  #defineHintsEachPoint(positions: ShiftDto[], positionTemplate: ShiftDto[]) {
    const hintsShift = [];

    for (let i = 0; i < positions.length; i++) {
      const { x: tx, y: ty } = positionTemplate[i];
      const { x, y } = positions[i];

      if (
        tx < x + Difference.DISTANCE &&
        tx > x - Difference.DISTANCE &&
        ty < y + Difference.DISTANCE &&
        ty > y - Difference.DISTANCE
      ) {
        hintsShift.push('ok');
        continue;
      }

      if (tx > x + Difference.DISTANCE) {
        hintsShift.push('right');
      } else if (tx < x - Difference.DISTANCE) {
        hintsShift.push('left');
      }

      if (ty > y + Difference.DISTANCE) {
        hintsShift.push('up');
      } else if (ty < y - Difference.DISTANCE) {
        hintsShift.push('down');
      }
    }

    return hintsShift;
  }

  generate(positions: ShiftDto[], positionTemplate: ShiftDto[]) {
    const hintsEyebrows = this.#defineHintsEachPoint(
      positions,
      positionTemplate,
    );

    const updateHints = this.#countValuesHints(hintsEyebrows);

    const hints = this.#defineHints(updateHints);

    return hints;
  }
}
