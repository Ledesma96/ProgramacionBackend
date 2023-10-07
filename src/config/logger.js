import winston from 'winston';

const customLevelOptions = {
    fatal: 0,
    error: 1, 
    warning: 2,
    info: 3,
    debugger: 4,
};

export const logger = winston.createLogger({
    levels: customLevelOptions, 
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.simple()),
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning',
            format: winston.format.simple(),
        }),
    ],
});

export const addLoger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleString()}`);

    next();
};
