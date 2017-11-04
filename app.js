'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

// allowed routes
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// use JSON for displaying errors
app.use(function (err, req, res, next) {
  /* jshint unused: false */
  err.status = err.status || 500;
  res.status(err.status).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;