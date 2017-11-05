#!/usr/bin/env node

var http = require('http');
var app = require('../app');

function normalizePort(val) {
  var port = parseInt(val, 10);
  return ((isNaN(port)) ? val : ((port >= 0) ? port : false));
}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

console.log(`Listening on port ${port}\n`);
