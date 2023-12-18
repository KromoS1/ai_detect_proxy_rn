export type Pokedex = {
  detection: AlignedRect;
  landmarks: Landmarks;
  unshiftedLandmarks: Landmarks;
  alignedRect: AlignedRect;
  angle: Angle;
};

export type AlignedRect = {
  _imageDims: Dims;
  _score: number;
  _classScore: number;
  _className: string;
  _box: Box;
};

export type Box = {
  _x: number;
  _y: number;
  _width: number;
  _height: number;
};

export type Dims = {
  _width: number;
  _height: number;
};

export type Angle = {
  roll: number;
  pitch: number;
  yaw: number;
};

export type Landmarks = {
  _imgDims: Dims;
  _shift: Shift;
  _positions: Shift[];
};

export type Shift = {
  _x: number;
  _y: number;
};

export interface ITemplateService {
  file_name: string;
  file_path: string;
  roll: number;
  pitch: number;
  yaw: number;

  shift: string;
  positions: string;
}
