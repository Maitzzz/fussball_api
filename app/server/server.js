exports.attach = function (options) {
  var app = this;

  var bodyParser = require('body-parser');
  var express = require('express');
  var _ = require('lodash-node');

  var WebSocketServer = require('ws').Server;
  app.wss = new WebSocketServer({port: 4444});

  app.jwt = require('jsonwebtoken');

  app.server = express();

  app.server.use("/uploads", express.static('uploads'));
  app.server.use(bodyParser.json());

  app.authUser = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['token'];

    if (token) {
      app.jwt.verify(token ,app.server.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate token'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided!'
      });
    }
  };

  app.server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token");

    next();
  });

  app.use(require('../services/drawService.js'));
  app.use(require('../routes/routes.js'));
  app.use(require('../routes/drawRoutes.js'));
};

exports.init = function(done) {
  require('http').createServer(this.server).listen(this.conf.port);
  console.log('Listesning on port ' + this.conf.port );
  done();
};


