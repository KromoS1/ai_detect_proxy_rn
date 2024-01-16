import { ShiftDto } from 'src/face-detector/domain/dto/detection.dto';
import { Difference, IHints } from 'src/hints/domain/dto/hints.service.dto';

export class PositionsHints implements IHints {
  _countValuesHints(arr) {
    return arr.reduce((count, value) => {
      count[value] = (count[value] || 0) + 1;

      return count;
    }, {});
  }

  _updateDirection(hints) {
    if (hints['left'] && hints['right']) {
      if (hints['left'] == hints['right']) {
        delete hints['right'];
      } else {
        hints['left'] > hints['right']
          ? delete hints['right']
          : delete hints['left'];
      }
    }

    if (hints['up'] && hints['down']) {
      if (hints['up'] == hints['down']) {
        delete hints['down'];
      } else {
        hints['up'] > hints['down'] ? delete hints['down'] : delete hints['up'];
      }
    }

    return hints;
  }

  _defineHints(hintsCount) {
    const { ok, ...restHint } = hintsCount;

    const hints = this._updateDirection(restHint);

    if (!ok) return Object.keys(hints);

    const res = [];

    Object.entries(hints).forEach((h) =>
      ok <= h[1] ? res.push(h[0]) : undefined,
    );

    if (res.length) return res;

    return ['ok'];
  }

  _defineHintsEachPoint(positions: ShiftDto[], positionTemplate: ShiftDto[]) {
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
    const hintsPosition = this._defineHintsEachPoint(
      positions,
      positionTemplate,
    );

    const updateHints = this._countValuesHints(hintsPosition);

    const hints = this._defineHints(updateHints);

    return hints;
  }
}
