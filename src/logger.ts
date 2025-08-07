import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'scranbot-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,          
      maxSize: '5m',                
      maxFiles: '14d',              
    }),
  ],
});

export default logger;
