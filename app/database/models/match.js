exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.match = app.db.define('match', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    side: {
      type: Sequelize.STRING
    },
    winning_team: {
      type: Sequelize.INTEGER
    },
    game: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      newMatch: function (callback) {
        app.game.getCurrentGame(function (err, gameId) {
          app.match.count({
            where: {
              game: gameId
            }
          }).then(function (ret) {

          });
        });
      },

      getCurrentMatch: function (callback) {
        app.game.getCurrentGame(function (err, gameId) {
          if (gameId) {
            app.match.findAll({
              where: {
                game: gameId,
                winning_team: null
              }
            }).then(function (match) {
              callback(false, match.id);
            })
          } else {
            //todo Game not found or ended.
          }
        });
      }
    }
  });
};