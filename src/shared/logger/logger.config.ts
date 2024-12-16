import { format, transports, LoggerOptions } from 'winston';

export const winstonConfig: LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, context }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${context || 'Application'}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, context }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${context || 'Application'}: ${message}`;
        }),
      ),
    }),
    new transports.File({
      filename: 'logs/application.log',
      dirname: 'logs',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
  ],
};
