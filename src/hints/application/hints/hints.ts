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
}
