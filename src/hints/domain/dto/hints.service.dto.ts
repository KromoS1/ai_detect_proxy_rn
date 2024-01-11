export enum Difference {
  PITCH = 2,
  ROLL = 20,
  YAW = 60,
  ZOOM = 100000,
  DISTANCE = 300,
}

export interface IHints {
  generate: (positions, positionTemplate) => any;
}

export type TDifference = keyof typeof Difference;
