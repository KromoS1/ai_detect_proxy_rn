import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  private readonly logsDir = './logs';

  async getAll() {
    return fs.readdirSync(path.join(process.cwd(), this.logsDir));
  }

  async getSpecificLog(date: string, file_name: string) {
    const logPath = path.join(
      process.cwd(),
      this.logsDir,
      date,
      `${file_name}.log`,
    );

    if (!fs.existsSync(logPath)) return null;

    const file = fs.readFileSync(logPath);

    return file.toString();
  }
}
