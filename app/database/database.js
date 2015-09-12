exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.db = new Sequelize(app.conf.db.database, app.conf.db.user, app.conf.db.password, { host: app.conf.db.host });

  app.use(require('./models/user.js'));
  app.use(require('./models/goal.js'));
  app.use(require('./models/team.js'));
  app.use(require('./models/match.js'));
  app.use(require('./models/game.js'));

/*  setTimeout(function() {
    app.db.sync({ force: true }).then(function(err, res) {
      if(err) {
        console.error(err);
      } else {
        console.log(res);
      }
    })
  }, 5000)*/
};
