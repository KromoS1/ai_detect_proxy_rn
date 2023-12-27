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
      socket: new LoggerFile(LoggerFile.nameFiles.socket),
      socket_error: new LoggerFile(LoggerFile.nameFiles.socket_error),
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
    this.filesLoggers.error.writeFile(`${stack}`);

    super.error(message, stack, context);
  }

  socket(type: 'log' | 'error', message: string, client_id?: string): void {
    const logger =
      type === 'log'
        ? this.filesLoggers.socket
        : this.filesLoggers.socket_error;

    const mess = client_id
      ? `[Client_id: ${client_id}] --- ${message}`
      : message;

    logger.writeFile(mess);
    super.log(mess);
  }

  writeLog(nameFile: NamesKeyFileType, message: unknown, context?: unknown) {
    const loggerFile = this.filesLoggers[nameFile];

    loggerFile.writeFile(`[${context}] --- ${message as string}`);
  }
}
