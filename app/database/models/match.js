exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');
  var _ = require('lodash-node');

  app.match = app.db.define('match', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
          app.match.findAll({
            where: {
              game: gameId
            }
          }).then(function (matches) {
            var ret = _.countBy(matches, function (a) {
              return a.winning_team;
            });

            _.forEach(ret, function (value, key) {
              if (value == 2) {
                app.game.setWinningTeam(gameId, key, function (err, ret) {
                  callback(false, ret);
                });
              } else {
                app.match.create({
                  game: gameId
                })
              }
            });
          });
        });
      },

      getCurrentMatch: function (callback) {
        app.game.getCurrentGame(function (err, gameId) {
          if (gameId) {
            app.match.findOne({
              where: {
                game: gameId,
                winning_team: null
              }
            }).then(function (match) {
              if (match.id) {
                callback(false, match.id);
              } else {
                callback(false, false);
              }
            })
          } else {
            callback(false, false)
          }
        });
      },

      getMatchData: function (callback) {
        app.match.getCurrentMatch(function (match) {
          callback(false, match);
        })
      },
      setWinningTeam: function (match, team, callback) {
        app.match.update({
          winning_team: team
        }, {
          where: {
            id: match
          }
        }).then(function (ret) {
          callback(false, ret);
        })
      }
    }
  });
};

//todo check if data is set
