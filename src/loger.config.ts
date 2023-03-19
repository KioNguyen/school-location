import { LoggerOptions, transports, format } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const loggerConfig: LoggerOptions = {
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
          prettyPrint: true,
        }),
      ),
    }),
    ,
    new transports.File({ filename: 'application.log' }),
  ],
};

export default loggerConfig;
