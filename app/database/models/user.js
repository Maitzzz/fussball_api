exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.user = app.db.define('user', {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    type: {
      type: Sequelize.INTEGER
    },
    active: {
      type: Sequelize.BOOLEAN
    }
  }, {
    classMethods: {
      getUserGames: function(start, end, callback) {

      },

      prioritizePlayers: function(players, callback) {
        var end = new Date();
        var start = app.getPeriod();

        app.game.getGames(start, end, function (err, games) {
          if(!err) {
            callback(false, games);
          }
        });
      }
    }
  });
};