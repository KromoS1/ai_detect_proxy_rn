import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LoggerFile } from '../logger/loggerFile';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: LoggerFile = new LoggerFile(LoggerFile.nameFiles.log);

  async use(req: Request, res: Response, next: NextFunction) {
    const message = `Method: ${req.method} -- Path: ${
      req.url
    } -- Params ${JSON.stringify(req.params)}\nQuery ${JSON.stringify(
      req.query,
    )}\nBody ${JSON.stringify(req.body)}\nHeaders: [Authorization - ${
      req.headers.authorization
    }]`;

    this.logger.writeFile(message);

    next();
  }
}
