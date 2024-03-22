import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
});

const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.File({
            level: "error",
            filename: "./errors.log",
            format: winston.format.simple()
        })
    ]
});

export const addLogger = (req, res, next) => {
    switch (process.env.NODE_ENV) {
        case "development":
            req.logger = developmentLogger;
            break;
        case "production":
            req.logger = productionLogger;
            break;
        default:
            throw new Error("Enviroment doesnt exists");
    }
    next()
};