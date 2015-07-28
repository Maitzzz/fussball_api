exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.db = new Sequelize(app.conf.db.database, app.conf.db.user, app.conf.db.password, { host: app.conf.db.host });



  app.use(require('./models/test.js'));
  app.use(require('./models/testlist.js'));


  setTimeout(function() {
    app.db.sync().then(function(err, res) {
      if(err) {
        console.error(err);
      } else {
        console.log(res);
      }
    })
  }, 5000)

  /*
    app.use(require('./models/consumer.js'));
    app.use(require('./models/connection.js'));
    app.use(require('./models/timer.js'));
    app.use(require('./models/user.js'));
  */
};
