'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const path = require('path');
const DBConnectionManager = require('../lib/db/DBConnectionManager');
const Repository = require('../lib/db/Repository');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/info', (req, res) => {
  res.send(process.env);
});

router.get('/db', (req, res) => {
  DBConnectionManager.startUp();
  res.send("DB Connection Successful");
});

router.put('/db' , (req, res) => {
  var data = Repository.save('MigrationDetail', {name : 'sf-1' , vmDiskMapping : { vm_1 : 'disk_1'} , manifest : { bla : 'bla'}, status : 'Initiated'}, {name:'prasad'}, {})
  res.send("Successfully Saved " + JSON.stringify(data));
});

router.get('/db/data' , (req, res) => {
  Repository.findOne('MigrationDetail', {name : 'sf-1'}).tap((dataInDB) => console.log(JSON.stringify(dataInDB)));
  res.send("Successfully Retrieved ");
});

module.exports = router;