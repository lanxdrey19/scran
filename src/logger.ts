import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { TransformableInfo } from 'logform'; 

const logFormat = format.printf((info: TransformableInfo) => {
  const timestamp = info.timestamp || new Date().toISOString();
  return `[${timestamp}] [${info.level.toUpperCase()}] ${info.message}`;
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
