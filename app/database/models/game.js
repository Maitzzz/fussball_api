exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');
  var eachAsync = require('each-async');
  var _ = require('lodash-node');

  app.game = app.db.define('game', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start: {
      type: Sequelize.DATE
    },
    end: {
      type: Sequelize.DATE
    },
    winning_team: {
      type: Sequelize.INTEGER
    },
    team1: {
      type: Sequelize.INTEGER
    },
    team2: {
      type: Sequelize.INTEGER
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      createGame: function (players, callback) {
        if (players.length >= app.conf.players_in_game) {
          app.team.create({
            player_one: players[0],
            player_two: players[1]
          }).then(function (team1) {
            app.team.create({
              player_one: players[2],
              player_two: players[3]
            }).then(function (team2) {
              app.game.create({
                start: new Date().toLocaleString(),
                team1: team1.id,
                team2: team2.id
              }).then(function (game) {
                if (game.id) {
                  app.match.create({
                    game: game.id
                  }).then(function (match) {
                    callback(false, game.id, match.id);
                  })
                }
                return false;
              });
            });
          });
        }
      },
      getCurrentGame: function (callback) {
        app.db.query('SELECT id, winning_team FROM games WHERE active = 1 ORDER BY id DESC LIMIT 1', {type: Sequelize.QueryTypes.SELECT}).then(function (res) {
          if (!app.isEmptyObject(res)) {
            if (res[0].winning_team == null) {
              callback(false, res[0].id);
            } else {
              callback(false, false);
            }
          } else {
            callback(true, false);
          }
        });
      },

      getCurrentGameData: function (callback) {
        app.game.getCurrentGame(function (err, gameId) {
          if (gameId) {
            app.game.getGameDataById(gameId, function (err, game) {
              callback(false, game);
            })
          } else {
            callback(false, {error: 409, message: 'Currently there are no game in progress!'})
          }
        });
      },

      getGameDataById: function (id, callback) {
        var data = {};
        var matchesData = [];
        app.game.findById(id).then(function (game) {
          app.match.findAll({
            where: {
              game: id
            }
          }).then(function (matches) {
            data.game = game.dataValues;
            eachAsync(matches, function (item, index, done) {
              app.goal.findAll({
                where: {
                  match: item.id
                }
              }).then(function (goals) {
                var match = item.dataValues;
                match.goals = goals;

                var test = _.countBy(goals, function (a) {
                  return a.team;
                });

                match.stats = test;

                matchesData.push(match);
                done();
              });
            }, function (error) {
              data.matches = matchesData;
              callback(false, data);
            });
          });
        });
      },
      setWinningTeam: function (game, team, callback) {
        app.game.update({
          winning_team: team,
          end: new Date()
        }, {
          where: {
            id: game
          }
        }).then(function (ret) {
          callback(false, ret);
        })
      },

      drawGame: function (players, callback) {
        if (players.length >= app.conf.players_in_game) {
          app.game.getCurrentGame(function (err, current_game) {
            if (!current_game) {
              app.user.prioritizePlayers(players, function (err, priotitized) {
                if (!err) {
                  app.game.createGame(priotitized, function (err, game) {
                    callback(false, game)
                  });
                } else {
                  callback(true, {message : 'Error with proiritizing players'});
                }
              });
            } else {
              callback(true, { message: 'Game is alseady running!'});
            }
          });
        } else {
          callback(true, {message: 'Not enough players!'});
        }
      },

      getGames: function (start, end, callback) {
        app.game.findAndCount({
          where: {
            createdAt: {
              $between: [start, end]
            }
          }
        }).then(function (games) {
          callback(false, games);
        });
      },
      removeGame: function(game_id, callback) {
        app.game.update({
          active: false
        }, {
          where: {
            id: game_id
          }
        }).then(function(ret) {
          callback(false, ret);
        });
      }
    }
  });

  };

