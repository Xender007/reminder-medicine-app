const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

var infoTransport = new transports.DailyRotateFile({
  level: 'info',
  filename: 'logs/med-app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '20d'
});

var errorTransport = new transports.DailyRotateFile({
  level: 'error',
  filename: 'logs/med-app-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '20d'
});

// transport.on('rotate', function(oldFilename, newFilename) {
//   // do something fun
// });



var logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.prettyPrint(),
    format.printf(info => `${info.timestamp} [ ${info.level.toUpperCase()} ]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    infoTransport, // will be used on info level
    errorTransport  // will be used on error level
  ]
});


module.exports = logger;

