export class Pokedex {
  detection: AlignedRectDto;
  landmarks: LandmarksDto;
  unshiftedLandmarks: LandmarksDto;
  alignedRect: AlignedRectDto;
  angle: AngleDto;
}

export class AlignedRectDto {
  imageDims: DimsDto;
  score: number;
  classScore: number;
  className: string;
  box: BoxDto;
}

export class BoxDto {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class DimsDto {
  width: number;
  height: number;
}

export class AngleDto {
  roll: number;
  pitch: number;
  yaw: number;
}

export class LandmarksDto {
  imgDims: DimsDto;
  shift: ShiftDto;
  positions: ShiftDto[];
}

export class ShiftDto {
  x: number;
  y: number;
}
