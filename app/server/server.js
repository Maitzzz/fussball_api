exports.attach = function (options) {
  var app = this;

  var bodyParser = require('body-parser');
  var express = require('express');
  var _ = require('lodash-node');
  var session = require('express-session');
  var MySqlStore = require('express-mysql-session');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var passport = require('passport');

  app.passport = require('passport');

  app.server = express();

  app.server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MySqlStore(app.conf.db)
  }));

  app.server.use(passport.initialize());
  app.server.use(passport.session());
  app.use(require('../routes/routes.js'));

  passport.use(new GoogleStrategy(app.conf.auth, function(accessToken, refreshToken, profile, done) {
      console.log(profile)
    var email = profile._json.emails[0].value;
    console.log('====================================')
    console.log(email)
    app.user.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        email: email
      }
    }).spread(function (user, created) {
      return done(null, user.values);
    });
  }));

  app.server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  passport.serializeUser(function(user, done) {
    console.log('===================================P')
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('===================================P1')
    app.user.find(id).then(function(user) {
      done(null, user.values);
    });
  });
};

exports.init = function(done) {
  require('http').createServer(this.server).listen(this.conf.port);
  console.log('Listesning on port ' + this.conf.port );
  done();
};


