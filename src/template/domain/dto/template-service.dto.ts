export type Pokedex = {
  detection: AlignedRect;
  landmarks: Landmarks;
  unshiftedLandmarks: Landmarks;
  alignedRect: AlignedRect;
  angle: Angle;
};

export type AlignedRect = {
  imageDims: Dims;
  score: number;
  classScore: number;
  className: string;
  box: Box;
};

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Dims = {
  width: number;
  height: number;
};

export type Angle = {
  roll: number;
  pitch: number;
  yaw: number;
};

export type Landmarks = {
  imgDims: Dims;
  shift: Shift;
  positions: Shift[];
};

export type Shift = {
  x: number;
  y: number;
};

export interface ITemplateService {
  file_name: string;
  file_path: string;

  type: string;
  imgDims: string;
  roll: number;
  pitch: number;
  yaw: number;
  rect: string
  positions: string;
}
