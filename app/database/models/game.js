exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

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
        app.team.create({
          player_one: 1,
          player_two: 2
        }).then(function (team1) {
          app.team.create({
            player_one: 3,
            player_two: 4
          }).then(function (team2) {
            app.game.create({
              start: new Date().toLocaleString(),
              team1: team1.id,
              team2: team2.id
            }).then(function (game) {
              if (game.id) {
                app.match.newMatch(game.id, function(match) {
                  console.log(game.id);
                  callback(false ,game.id, match.id);
                });
              }
              return false;
            });
          });
        });
      },
      getCurrentGame: function(callback) {
        app.db.query('SELECT id, winning_team FROM games ORDER BY id DESC LIMIT 1',{ type: Sequelize.QueryTypes.SELECT}).then(function(res)  {
          console.log(res[0].winning_team);
          if(res[0].winning_team != null) {
            callback(false, res[0].id);
          } else {
            callback(false, true);
          }
        });
      }
    }
  });
};