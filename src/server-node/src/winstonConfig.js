
const { createLogger, format, transports } = require('winston')
const { printf } = format

const customFormat = printf(({ message }) => {
    return `${message.trim()}`;
});

var options = {
    file: {
      level: 'info',
      filename: `${__dirname}/logs/app.log`,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    },
    fileExceptions: {
        filename: `${__dirname}/logs/exceptions.log`,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
    },
};

const logger = new createLogger({
    format: customFormat,
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console),
    ],
    exitOnError: false,
}); 

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};

logger.exceptions.handle(
    new transports.File(options.fileExceptions),
)

module.exports = logger;