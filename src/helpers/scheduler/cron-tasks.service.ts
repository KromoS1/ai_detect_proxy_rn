import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronTasksService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { disabled: false })
  async removeOldQueryLogs() {
    const logs = fs.readdirSync(path.join(process.cwd(), '/logs'));

    const toBeDeleted = logs.slice(0, logs.length - 7);

    for (const dir of toBeDeleted) {
      fs.rmSync(path.join(process.cwd(), '/logs', dir), {
        recursive: true,
        force: true,
      });
    }

    console.log(`Logs ${toBeDeleted} was deleted successfully`);
  }
}
