var broadway = require('broadway');
var app = new broadway.App();

var express = require('express');
app.cors = require('cors');

app.server = express();
app.server.use(app.cors());

console.log('test');
app.conf = require('config').get('app');
app._ = require('lodash-node');

app.use(require('./database/database.js'));
app.use(require('./server/server.js'));

app.init(function (err) {
  if (err) console.log(err);
});