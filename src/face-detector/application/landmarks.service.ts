import { Injectable } from '@nestjs/common';

import { AngleDto, ShiftDto } from '../domain/dto/detection.dto';
import { VariantsTemplateType } from '../domain/dto/face-detector.service.dto';

import { Dims } from 'src/template/domain/dto/template-service.dto';

@Injectable()
export class LandmarksService {
  readonly EYEBROWS = [17, 27];
  readonly LIPS = [48, 68];

  getLandmarksData(type: VariantsTemplateType, detectionData) {
    const angle = this.getAngle(detectionData);
    const positions = this.getPosition(type, detectionData.landmarks.positions);
    const shift = this.getShift(detectionData);
    const imgDims = this.getImgDims(detectionData);

    return { angle, positions, shift, imgDims };
  }

  getPosition(type: VariantsTemplateType, positions: ShiftDto[]): ShiftDto[] {
    if (!positions.length) return;

    const [start, end] = this[type];

    return positions.slice(start, end).map((position) => ({
      x: position.x,
      y: position.y,
    }));
  }

  getAngle(detectData): AngleDto {
    return detectData.angle as AngleDto;
  }

  getShift(detectData): ShiftDto {
    const { _x, _y } = detectData.landmarks.shift;

    return { x: _x, y: _y } as ShiftDto;
  }

  getImgDims(detectData): Dims {
    const { _width, _height } = detectData.detection._imageDims;

    return { width: _width, height: _height } as Dims;
  }
}
