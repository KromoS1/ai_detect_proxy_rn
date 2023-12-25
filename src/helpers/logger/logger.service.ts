import { ConsoleLogger, Injectable } from '@nestjs/common';
import { LoggerFile, NamesKeyFileType } from './loggerFile';

@Injectable()
export class KromLogger extends ConsoleLogger {
  private filesLoggers;
  constructor() {
    super();
    this.filesLoggers = {
      log: new LoggerFile(LoggerFile.nameFiles.log),
      warn: new LoggerFile(LoggerFile.nameFiles.warn),
      error: new LoggerFile(LoggerFile.nameFiles.error),
      message: new LoggerFile(LoggerFile.nameFiles.message),
    };
  }

  log(message: unknown, context?: unknown): void {
    this.writeLog(LoggerFile.nameFiles.log, message, context);
    super.log(message, context);
  }

  warn(message: unknown, context?: unknown): void {
    this.writeLog(LoggerFile.nameFiles.warn, message, context);
    super.warn(message, context);
  }

  error(message: any, stack?: string, context?: string): void {
    // const log = `[${context}] --- ${message as string}\n${stack}`;
    this.filesLoggers.error.writeFile(`${stack}`);

    super.error(message, stack, context);
  }

  writeLog(nameFile: NamesKeyFileType, message: unknown, context?: unknown) {
    const loggerFile = this.filesLoggers[nameFile];

    loggerFile.writeFile(`[${context}] --- ${message as string}`);
  }
}
