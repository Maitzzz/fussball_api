exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.db = new Sequelize(app.conf.db.database, app.conf.db.user, app.conf.db.password, { host: app.conf.db.host , logging: false});

  app.use(require('./models/user.js'));
  app.use(require('./models/goal.js'));
  app.use(require('./models/team.js'));
  app.use(require('./models/file.js'));
  app.use(require('./models/match.js'));
  app.use(require('./models/game.js'));
/*
  setTimeout(function() {
    app.db.sync({force: true}).then(function(err, res) {
      if(err) {
        app.winston.log('error','DATABASE sync error');
        console.log(err)

      } else {
        app.winston.log('DATABASE sync success');
      }
    })
  }, 1000)*/
};
