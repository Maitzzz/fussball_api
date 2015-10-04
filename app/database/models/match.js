exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

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
            app.match.createNewMatch(gameId, matches, function (err, newMatch) {
              callback(err, newMatch);
            })
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
      },
      createNewMatch: function (gameId, matches, callback) {
        app.game.findById(gameId).then(function (game) {
          if (!game.winning_team) {
            var ret = app._.countBy(matches, function (a) {
              return a.winning_team;
            });

            var winning_team = app.findKey(ret, 2);

            if (winning_team) {
              app.game.setWinningTeam(gameId, winning_team, function(err, ret) {
                app.pushMessages('websocket', 'winner is set');
                callback(false, ret);
              });
            } else {
              app.match.create({
                game: gameId
              }).then(function(newMatch) {
                callback(false, 'match_created');
              });
            }
          }
        });
      }
    }
  });
};

//todo check if data is set
