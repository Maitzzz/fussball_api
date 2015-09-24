exports.attach = function (options) {
  var app = this;

  var bodyParser = require('body-parser');
  var express = require('express');
  var _ = require('lodash-node');

  app.server = express();
  app.server.use(bodyParser.json());

  app.server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(require('../routes/routes.js'));
};

exports.init = function(done) {
  require('http').createServer(this.server).listen(this.conf.port);
  console.log('Listesning on port ' + this.conf.port );
  done();
};


