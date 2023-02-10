import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

import { LogLevel } from '@common/enums';
import { getDateNow } from '@common/helpers/date';

import { writeFile } from './log.util';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  writeLog(
    level: LogLevel,
    method: string,
    path: string,
    message: string,
  ): void {
    const dateNow = getDateNow();

    const data = `[${level}] ${dateNow.toISOString()}: [${method} ${path}] ${message}\r\n`;

    writeFile(level, data);
  }
}
