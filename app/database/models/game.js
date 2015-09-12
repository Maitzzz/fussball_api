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
      creategame: function (players, callback) {
        var team1, team2;

        app.team.create({
          player_one: 1,
          player_two: 2
        }).then(function (ret) {
          team1 = ret;

          app.team.create({
            player_one: 3,
            player_two: 4
          }).then(function (ret) {
            team2 = ret;

            app.game.create({
              start: new Date().toLocaleString(),
              team1: team1.id,
              team2: team2.id
            }).then(function (ret) {
              if (ret.id) {
                console.log(ret.id);
                callback(ret.id);
              }
              return false;
            });
          });
        });
      }
    }
  });
};