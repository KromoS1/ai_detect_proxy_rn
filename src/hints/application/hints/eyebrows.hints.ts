import { Hints, IHints } from './hints';

import { ShiftDto } from 'src/face-detector/domain/dto/detection.dto';

export class EyebrowsHints extends Hints implements IHints {
  distance: number = 300;

  updateDirection(hints) {

    if(hints['left'] && hints['right']) {

      hints['left'] > hints['right'] ? delete hints['right'] : delete hints['left']
    } 
    
    if(hints['up'] && hints['down']) {

      hints['up'] > hints['down'] ? delete hints['down'] : delete hints['up']
    } 

    return hints
  }

  defineHints(hintsCount) {
    const { ok, ...resthint } = hintsCount;

    if (!ok) return Object.keys(resthint);
  
    const hints = this.updateDirection(resthint)

    const res = [];

    Object.entries(hints).forEach((h) => ok <= h[1] ? res.push(h[0]) : undefined);

    if (res.length) return res;

    return ['ok'];
  }
 
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
    const hintsEyebrows = this.defineHintsEachPoint(
      positions,
      positionTemplate,
    );
    
    const updateHints = this.countValuesHints(hintsEyebrows);
    
    const hints = this.defineHints(updateHints);

    return hints;
  }
}
