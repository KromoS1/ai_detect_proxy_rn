import { Injectable } from '@nestjs/common';
import { AngleDto, ShiftDto } from '../domain/dto/detection.dto';
import { VariantsTemplateType } from '../domain/dto/face-detector.service.dto';

@Injectable()
export class LandmarksService {
  readonly EYEBROWS = [17, 27];
  readonly LIPS = [48, 68];

  getLandmarksData(type: VariantsTemplateType, detectionData) {
    const angle = this.getAngle(detectionData);
    const positions = this.getPosition(type, detectionData.landmarks.positions);

    return { angle, positions };
  }

  getPosition(type: VariantsTemplateType, positions: ShiftDto[]): ShiftDto[] {
    if (!positions.length) return;

    const [start, end] = this[type];

    return positions.slice(start, end);
  }

  getAngle(detectData): AngleDto {
    return detectData.angle as AngleDto;
  }
}
