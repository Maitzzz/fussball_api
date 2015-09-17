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
        type: Sequelize.TIME
      },
      end: {
        type: Sequelize.TIME
      },
      winning_team: {
        type: Sequelize.INTEGER
      },
      team1: {
        type: Sequelize.INTEGER
      },
      team2: {
        type: Sequelize.INTEGER
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
          app.db.query('SELECT id, winning_team FROM games ORDER BY id DESC LIMIT 1', {type: Sequelize.QueryTypes.SELECT}).then(function (res) {
            if (!app.isEmptyObject(res)) {
              if (res[0].winning_team == null) {
                callback(false, res[0].id);
              } else {
                console.log('sttt23132t')
                callback(false, false);
              }
            } else {
              callback(true, {error:'Games does not exist'});
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
            winning_team: team
          }, {
            where: {
              id: game
            }
          }).then(function (ret) {
            callback(false, ret);
          })
        },

        drawGame: function (players, callback) {
          console.log(players + 'dasda');
          if (players.length >= app.conf.players_in_game) {
            app.user.prioritizePlayers(players, function (err, ret) {
              callback(false, ret)
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
        newGame: function (players, callback) {
          app.game.drawGame(players, function (err, ret) {
            res.json(ret);
          });

          app.game.createGame({}, function (err, ret) {
            res.json({
              game: ret
            })
          })
        }
      }
    }
  )
  ;

}
;

