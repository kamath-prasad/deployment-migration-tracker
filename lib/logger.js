'use strict';

const _ = require('lodash');
const winston = require('winston');
/* jshint expr:true */
require('winston-syslog').Syslog;

winston.emitErrs = true;

const transports = [
  new winston.transports.File({
    prettyPrint: true,
    level: 'debug',
    silent: false,
    colorize: false,
    timestamp: true,
    filename: '../app.log',
    json: false
  }),
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'debug',
    silent: _.includes(['production', 'test'], process.env.NODE_ENV),
    prettyPrint: true,
    colorize: true,
    timestamp: true
  }),
  new winston.transports.Syslog({
    level: 'debug',
    protocol: 'tcp4',
    eol: '\n',
    formatter: (options) => `${options.level.toUpperCase()}  ${options.message || ''}`
  })
];

class Stream {
  constructor(logger) {
    this.logger = logger;
  }
  write(message, encoding) {
    /* jshint unused:false */
    this.logger.info(message);
  }
}

const logger = new winston.Logger({
  transports: transports,
  exitOnError: true
});
logger.stream = new Stream(logger);

module.exports = logger;