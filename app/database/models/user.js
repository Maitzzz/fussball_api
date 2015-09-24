exports.attach = function (options) {
  var app = this;
  var eachAsync = require('each-async');
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
      prioritizePlayers: function (players, callback) {
        var end = new Date();
        var start = app.getPeriod();
        app.user.getPlayersGamesCountInPeriod(end, start,players, function(err, ret) {
          if (!app.isEmptyObject(ret)) {
            var inGame = [];
            app._.forEach(ret, function(val) {
              if (app._.indexOf(players, val.player) != -1) {
                inGame.push(val);
              }
            });
            var temp = app._.sortByOrder(app._.shuffle(inGame), ['count'], ['asc']);
            console.log(temp);
            callback(false, app._.pluck(temp, 'player'));
          } else {
            callback(false, players);
          }
        });
      },
      getPlayersGamesCountInPeriod: function(end, start, players, callback) {
        app.game.getGames(start, end, function (err, games) {
          if (!err) {
            var teams = [];
            eachAsync(games.rows, function (item, index, done) {
              app.team.findById(item.team1).then(function (team1) {
                teams.push(team1.player_one);
                teams.push(team1.player_two);
                app.team.findById(item.team2).then(function (team2) {
                  teams.push(team2.player_one);
                  teams.push(team2.player_two);
                  done();
                });
              });
            }, function (error) {
              var players_swap = app.compressArray(teams);
              app._.forEach(players, function(player) {
                if(app._.find(players_swap , { player: player}) == undefined) {
                  players_swap .push({
                    player: player,
                    count:0
                  });
                }
              });
              callback(error, players_swap);
            });
          }
        });
      },
      validateUser: function(uid, callback) {
        app.user.findById(1).then(function(ret) {
          if (ret == null || !ret.active ) {
            callback(false, false);
          } else {
            callback(false, true);
          }
        });
      }

    }
  });
};