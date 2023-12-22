import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import * as fs from 'fs';

type NamesFileType = {
  log: 'log';
  warn: 'warn';
  error: 'error';
  message: 'message';
};

export type NamesKeyFileType = NamesFileType[keyof NamesFileType];

@Injectable()
export class LoggerFile {
  static nameFiles: NamesFileType = {
    log: 'log',
    warn: 'warn',
    error: 'error',
    message: 'message',
  };

  private formatTime = 'DD-MM-YYYY HH:mm:SS';
  private formatDate = 'DD-MM-YYYY';

  private nowTime: string = '';
  private dirDate: string = '';

  private logger: Logger = new Logger('LOGGER_FILE');

  private name_file_log: NamesKeyFileType = null;

  constructor(name_file_log: NamesKeyFileType) {
    this.nowTime = moment().format(this.formatTime);
    this.dirDate = moment().format(this.formatDate);
    this.name_file_log = name_file_log;

    this.checkCreateDir();
  }

  private checkCreateDir = () => {
    if (!fs.existsSync(`logs/${this.dirDate}`)) {
      fs.mkdirSync(`logs/${this.dirDate}`, { recursive: true });
    }
  };

  private openFile = (nameFile: NamesKeyFileType) => {
    fs.open(`./logs/${this.dirDate}/${nameFile}.log`, 'r+', (err: Error) => {
      if (err) this.logger.log(err);
    });
  };

  private appendFile = (nameFile: NamesKeyFileType, message: string) => {
    fs.appendFile(
      `logs/${this.dirDate}/${nameFile}.log`,
      message,
      (err: Error) => {
        if (err) this.logger.log(err);
      },
    );
  };

  writeFile = (message: string) => {
    fs.readFile(
      `./logs/${this.dirDate}/${this.name_file_log}.log`,
      'utf-8',
      (err: Error) => {
        if (err) {
          this.openFile(this.name_file_log);
        }

        const updateMessage = `[${this.nowTime}]\n${message}\n\n`;

        this.appendFile(this.name_file_log, updateMessage);
      },
    );
  };
}
