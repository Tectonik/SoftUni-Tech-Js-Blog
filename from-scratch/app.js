const express = require('express');
const config = require('./config/config');
const app = express();

require('./config/express')(app, config);
require('./config/passport')();

module.exports = app;