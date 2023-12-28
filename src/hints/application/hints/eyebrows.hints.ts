import { Hints, IHints } from './hints';

import { ShiftDto } from 'src/face-detector/domain/dto/detection.dto';

export class EyebrowsHints extends Hints implements IHints {
  distance: number = 300;

  defineHints(hintsCount) {
    const { ok, ...resthint } = hintsCount;

    if (!ok) return Object.keys(resthint);

    const res = [];

    Object.entries(resthint).forEach((h) =>
      ok >= h[1] ? res.push(h[0]) : undefined,
    );

    if (res.length) return res;

    return ['ok'];
  }
  //TODO: сделать расчет наоборот, пройтись по точкам двух массивов и отнять значения, после результрующий массив сравивать с distance и генерить подсказки
  defineHintsEachPoint(positions: ShiftDto[], positionTemplate: ShiftDto[]) {
    const hintsShift = [];

    for (let i = 0; i < positions.length; i++) {
      const { x: tx, y: ty } = positionTemplate[i];
      const { x, y } = positions[i];

      if (
        tx < x + this.distance &&
        tx > x - this.distance &&
        ty < y + this.distance &&
        ty > y - this.distance
      ) {
        hintsShift.push('ok');
        continue;
      }

      if (tx > x + this.distance) {
        hintsShift.push('right');
      } else if (tx < x - this.distance) {
        hintsShift.push('left');
      }

      if (ty > y + this.distance) {
        hintsShift.push('up');
      } else if (ty < y - this.distance) {
        hintsShift.push('down');
      }
    }

    return hintsShift;
  }

  generate(positions: ShiftDto[], positionTemplate: ShiftDto[]) {
    const leftEyebrows = this.defineHintsEachPoint(
      positions.slice(0, 5),
      positionTemplate.slice(0, 5),
    );
    const rightEyebrows = this.defineHintsEachPoint(
      positions.slice(5, 10),
      positionTemplate.slice(5, 10),
    );

    const leftHints = this.countValuesHints(leftEyebrows);
    const rightHints = this.countValuesHints(rightEyebrows);

    const resultHints = {
      left: this.defineHints(leftHints),
      right: this.defineHints(rightHints),
    };

    return resultHints;
  }
}
