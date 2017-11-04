'use strict';

const Mongoose = require('mongoose');
const CONST = require('../constants');

const MigrationDetailSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  vmDiskMapping: {
    type: Object,
    required: true
  },
  manifest: {
    type: Object
  },
  logs: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
});

Mongoose.model(CONST.DB_MODEL.MIGRATION_DETAIL, MigrationDetailSchema);
module.exports.MigrationDetailSchema = MigrationDetailSchema;