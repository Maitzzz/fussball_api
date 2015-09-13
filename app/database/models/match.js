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
            var teamMatches = _.groupBy(matches, 'winning_team');


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
      },

      getMatchData: function(callback) {
        app.match.getCurrentMatch(function (match) {
          callback(false, match);
        })
      },
      setWinningTeam: function(match, team, callback) {
        app.match.update({
          winning_team: team
        }, {
          where: {
            id: match
          }
        }).then(function(ret) {
          callback(false, ret);
        })
      }
    }
  });
};

//todo check if data is set