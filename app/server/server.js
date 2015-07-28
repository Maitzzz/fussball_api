exports.attach = function (options) {
  var app = this;

  var bodyParser = require('body-parser');
  var express = require('express');
  app.server = express();

  app.server.use(bodyParser.json());

  app.use(require('../routes/routes.js'));
};

exports.init = function(done) {
  require('http').createServer(this.server).listen(this.conf.port);
  console.log('Listesning on port ' + this.conf.port );
  done();
}
