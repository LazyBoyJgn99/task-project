import * as winston from 'winston';
import { createLogger } from 'winston';
import { utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

export const LogStoreInstance = createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),

    new winston.transports.DailyRotateFile({
      level: 'warn',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),

    // new winston.transports.DailyRotateFile({
    //   level: 'info',
    //   dirname: 'logs',
    //   filename: 'info-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD',
    //   zippedArchive: true,
    //   maxSize: '20m',
    //   maxFiles: '14d',
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.simple(),
    //   ),
    // }),
  ],
});
