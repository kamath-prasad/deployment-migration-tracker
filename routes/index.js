'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/info', (req, res) => {
  res.send(process.env);
});

module.exports = router;