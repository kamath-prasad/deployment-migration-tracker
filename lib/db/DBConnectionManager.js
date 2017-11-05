'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const CONST = require('../constants');
mongoose.Promise = Promise;

class DbConnectionManager {

  constructor() {
    console.log('Do nothing');
  }

  startUp() {
    try {
      const connection = mongoose
        .connect(JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri)
        .catch(err => {
          console.log(err);
        });
      // Initialize schemas & define models
      require('./MigrationDetailSchema');
      console.log('Completed loading of mongoose Schemas');
      mongoose.connection.on('connected', () => {
        console.log('Successfully connected to MongoDB');
      });
      mongoose.connection.on('error', (err) => {
        console.log(err);
      });
      mongoose.connection.on('disconnected', () => {
        console.log('Successfully Disconnected from MongoDB');
      });
      return connection;
    } catch (err) {
      console.log(err);
    }
  }

  shutDown(info) {
      console.log('DB going to shutdown. Reason');
      return mongoose
        .connection
        .close(() => {
          console.log('Mongoose connection closed');
        });
    }
  }

module.exports = new DbConnectionManager();