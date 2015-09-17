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
        app.user.getPlayerGamesCountInPeriod(end, start, function(err, ret) {
          // get 4 last counts
          var inGame = [];
          app._.forEach(ret, function(val) {
            if (app._.indexOf(players, val.player) != -1) {
              inGame.push(val);
            }
          });
          var temp = app._.sortByOrder(app._.shuffle(inGame), ['count'], ['asc']);

          callback(false, temp)
        });
      },
      getPlayerGamesCountInPeriod: function(end, start,callback) {
        app.game.getGames(start, end, function (err, games) {
          if (!err) {
            var teams = [];
            console.log(games.count);
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
              callback(error, app.compressArray(teams));
            });
          }
        });
      }

    }
  });
};