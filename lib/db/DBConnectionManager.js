'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const logger = require('../logger');
const CONST = require('../constants');
mongoose.Promise = Promise;

class DbConnectionManager {
  startUp(config) {
    try {
      const connection = mongoose
        .connect(config.url)
        .catch(err => {
          logger.error('Error connecting to mongo ->', err);
        });
      // Initialize schemas & define models
      require('./MigrationDetailSchema');
      logger.debug('Completed loading of mongoose Schemas');
      mongoose.connection.on('connected', () => {
        logger.info('Successfully connected to MongoDB');
      });
      mongoose.connection.on('error', (err) => {
        logger.error('Mongoose connection error: ' + err);
      });
      mongoose.connection.on('disconnected', () => {
        logger.error('Mongoose connection disconnected');
      });
      return connection;
    } catch (err) {
      logger.error('Error occurred while initializing mongo :=', err);
    }
  }

  shutDown(info) {
      logger.info('DB going to shutdown. Reason : ', info);
      return mongoose
        .connection
        .close(() => {
          logger.info('Mongoose connection closed');
        });
    }
  }
}

module.exports = new DbConnectionManager();