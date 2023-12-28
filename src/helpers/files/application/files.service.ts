import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import { Injectable } from '@nestjs/common';

import { KromLogger } from 'src/helpers/logger/logger.service';

@Injectable()
export class FilesService {
  constructor(private logger: KromLogger) {}

  listFilesByPath(pathDir: string) {
    return fs.readdirSync(path.join(process.cwd(), pathDir));
  }

  checkFileByPath(file_path: string) {
    return new Promise<boolean>((resolve) => {
      const directoryPath = path.join(process.cwd(), file_path);

      fs.access(`${directoryPath}`, fs.constants.F_OK, (err) => {
        if (err) {
          this.logger.error(err.message, err.stack, err.name);
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  async removeFile(file_path: string) {
    const isFile = await this.checkFileByPath(file_path);

    if (isFile) {
      const directoryPath = path.join(process.cwd(), file_path);

      fs.unlink(directoryPath, (err) => {
        if (err) {
          this.logger.error(err.message, err.stack, err.name);

          return;
        }
      });
    }
  }

  async getBuffer(file_path: string) {
    return await fs.promises.readFile(file_path);
  }

  getBufferFromBase64(base64: string, type_file: string): Buffer {
    const data = base64.replace(`data:${type_file};base64,`, '');

    return Buffer.from(data, 'base64');
  }
}
